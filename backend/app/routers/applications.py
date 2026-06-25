import json
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..risk_engine import build_score_snapshot

router = APIRouter(prefix='/applications', tags=['applications'])


def _serialize_list(value):
    if not value:
        return json.dumps([])
    if isinstance(value, list):
        return json.dumps(value)
    return json.dumps([value])


def _deserialize_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else [parsed]
        except json.JSONDecodeError:
            return [value]
    return [value]


def _normalize_status(status: str) -> str:
    mapping = {
        'PENDING': 'submitted',
        'UNDER_REVIEW': 'under-review',
        'MORE_INFO_REQUIRED': 'more-info-required',
        'APPROVED': 'approved',
        'REJECTED': 'rejected',
    }
    return mapping.get(status, status.lower())


def _status_query_to_db(status: str) -> str:
    mapping = {
        'submitted': 'PENDING',
        'under-review': 'UNDER_REVIEW',
        'more-info-required': 'MORE_INFO_REQUIRED',
        'approved': 'APPROVED',
        'rejected': 'REJECTED',
    }
    return mapping.get(status, status.upper())


def _build_timeline(application: models.LoanApplication) -> List[dict]:
    history = sorted(application.status_history, key=lambda entry: entry.created_at)
    events = []
    for index, event in enumerate(history):
        events.append(
            {
                'id': f't{event.id}',
                'label': event.status.replace('_', ' ').title(),
                'description': event.note or event.status.replace('_', ' ').title(),
                'date': event.created_at.strftime('%b %d, %Y'),
                'status': 'complete' if index < len(history) - 1 else 'current',
            }
        )

    if not events and application.created_at:
        events.append(
            {
                'id': f't{application.id}',
                'label': 'Submitted',
                'description': 'Application submitted',
                'date': application.created_at.strftime('%b %d, %Y'),
                'status': 'current',
            }
        )

    return events


def _application_payload(application: models.LoanApplication) -> dict:
    officer = 'Unassigned'
    if application.reviews:
        latest_review = max(application.reviews, key=lambda review: review.created_at)
        officer = latest_review.officer.name if latest_review.officer else 'Unassigned'

    return {
        'id': application.id,
        'applicant_id': application.applicant_id,
        'applicant': application.applicant.name,
        'email': application.applicant.email,
        'type': application.loan_type,
        'amount': application.amount,
        'termMonths': application.term_months,
        'rate': application.rate,
        'status': _normalize_status(application.status),
        'creditScore': application.credit_score or 0,
        'trustScore': application.trust_score or 0,
        'readinessScore': application.readiness_score or 0,
        'approvalProbability': application.approval_probability or 0,
        'annualIncome': application.annual_income or 0,
        'employmentType': application.employment_type or '',
        'income': application.monthly_income or (application.annual_income / 12 if application.annual_income else 0),
        'submittedAt': application.created_at.strftime('%b %d, %Y') if application.created_at else '',
        'purpose': application.purpose,
        'officer': officer,
        'riskScore': application.risk_score,
        'timeline': _build_timeline(application),
        'approvalReasons': _deserialize_list(application.approval_reasons),
        'rejectionReasons': _deserialize_list(application.rejection_reasons),
        'improvementSuggestions': _deserialize_list(application.improvement_suggestions),
        'manualReview': application.manual_review,
        'profileType': application.profile_type or application.applicant.borrower_type or 'first-time',
        'coApplicant': {
            'name': application.co_applicant_name,
            'relationship': application.co_applicant_relationship,
            'income': application.co_applicant_income or 0,
            'creditScore': application.co_applicant_credit_score or 0,
        } if application.co_applicant_name else None,
        'cashFlow': {
            'monthlyIncome': application.monthly_income or 0,
            'monthlyExpenses': application.monthly_expenses or 0,
            'surplus': application.cash_flow_surplus or 0,
            'stability': application.cash_flow_stability or '',
        },
        'educationSignal': application.education_signal or '',
        'careerSignal': application.career_signal or '',
        'documentChecklist': [
            {
                'id': f'd{document.id}',
                'label': document.document_type,
                'done': document.status.upper() in {'COMPLETED', 'APPROVED'},
                'hint': document.hint or '',
            }
            for document in application.documents
        ],
        'consent': application.consent_provided,
    }


@router.post('', response_model=schemas.LoanApplicationRead)
def create_application(application: schemas.LoanApplicationCreate, db: Session = Depends(get_db)):
    applicant = db.query(models.User).filter(models.User.id == application.applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail='Applicant user not found')

    snapshot = build_score_snapshot(
        amount=application.amount,
        annual_income=application.annualIncome,
        employment_type=application.employmentType,
        education_signal=application.educationSignal,
        career_signal=application.careerSignal,
        monthly_income=application.monthlyIncome,
        monthly_expenses=application.monthlyExpenses,
        co_applicant_credit_score=application.coApplicantCreditScore,
    )

    db_application = models.LoanApplication(
        applicant_id=application.applicant_id,
        loan_type=application.type,
        amount=application.amount,
        term_months=application.termMonths,
        rate=application.rate,
        annual_income=application.annualIncome,
        employment_type=application.employmentType,
        purpose=application.purpose,
        education_signal=application.educationSignal,
        career_signal=application.careerSignal,
        monthly_income=application.monthlyIncome,
        monthly_expenses=application.monthlyExpenses,
        cash_flow_stability=application.cashFlowStability,
        profile_type=application.profileType,
        co_applicant_name=application.coApplicantName,
        co_applicant_relationship=application.coApplicantRelationship,
        co_applicant_income=application.coApplicantIncome,
        co_applicant_credit_score=application.coApplicantCreditScore,
        risk_score=snapshot['risk_score'],
        status='PENDING',
        consent_provided=True,
        manual_review=application.amount < 10000 and snapshot['readiness_score'] < 70,
        approval_probability=snapshot['approval_probability'],
        readiness_score=snapshot['readiness_score'],
        credit_score=snapshot['credit_score'],
        trust_score=snapshot['trust_score'],
        approval_reasons=_serialize_list(snapshot['reasons']),
        rejection_reasons=json.dumps([]),
        improvement_suggestions=_serialize_list(snapshot['recommendations']),
        cash_flow_surplus=(application.monthlyIncome or 0) - (application.monthlyExpenses or 0),
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    score_record = models.ApplicationScore(
        application_id=db_application.id,
        readiness_score=db_application.readiness_score,
        credit_score=db_application.credit_score,
        trust_score=db_application.trust_score,
        approval_probability=db_application.approval_probability,
        reasons=db_application.approval_reasons,
        recommendations=db_application.improvement_suggestions,
        breakdown=json.dumps(snapshot),
    )

    db.add(score_record)
    db.add(models.StatusHistory(application_id=db_application.id, status='PENDING', note='Application created'))
    db.commit()

    return schemas.LoanApplicationRead(**_application_payload(db_application))


@router.get('', response_model=List[schemas.LoanApplicationRead])
def list_applications(
    applicant_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.LoanApplication)

    if applicant_id:
        query = query.filter(models.LoanApplication.applicant_id == applicant_id)

    if status:
        db_status = _status_query_to_db(status)
        query = query.filter(models.LoanApplication.status == db_status)

    items = query.order_by(models.LoanApplication.created_at.desc()).all()
    return [schemas.LoanApplicationRead(**_application_payload(item)) for item in items]


@router.get('/{application_id}', response_model=schemas.LoanApplicationRead)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return schemas.LoanApplicationRead(**_application_payload(application))


@router.put('/{application_id}/status', response_model=schemas.LoanApplicationRead)
def update_application_status(application_id: int, status_update: schemas.LoanApplicationStatusUpdate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = status_update.status
    db.add(models.StatusHistory(application_id=application.id, status=status_update.status, note='Status updated'))
    db.commit()
    db.refresh(application)
    return schemas.LoanApplicationRead(**_application_payload(application))


@router.get('/{application_id}/readiness', response_model=schemas.ReadinessScoreResponse)
def get_readiness_score(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return schemas.ReadinessScoreResponse(
        application_id=application.id,
        readiness_score=application.readiness_score or 0,
        credit_score=application.credit_score or 0,
        trust_score=application.trust_score or 0,
        approval_probability=application.approval_probability or 0,
        reasons=_deserialize_list(application.approval_reasons),
        recommendations=_deserialize_list(application.improvement_suggestions),
    )


@router.get('/{application_id}/score-breakdown', response_model=schemas.ApplicationScoreRead)
def get_score_breakdown(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    score_entry = db.query(models.ApplicationScore).filter(models.ApplicationScore.application_id == application_id).first()
    if not score_entry:
        raise HTTPException(status_code=404, detail='Score breakdown not found')

    return schemas.ApplicationScoreRead(
        application_id=application.id,
        readiness_score=score_entry.readiness_score,
        credit_score=score_entry.credit_score,
        trust_score=score_entry.trust_score,
        approval_probability=score_entry.approval_probability,
        reasons=_deserialize_list(score_entry.reasons),
        recommendations=_deserialize_list(score_entry.recommendations),
        breakdown=json.loads(score_entry.breakdown or '{}'),
        created_at=score_entry.created_at,
    )


@router.get('/{application_id}/status-history', response_model=List[schemas.StatusHistoryRead])
def get_status_history(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return db.query(models.StatusHistory).filter(models.StatusHistory.application_id == application_id).order_by(models.StatusHistory.created_at.asc()).all()


@router.post('/{application_id}/documents', response_model=schemas.DocumentRead)
def upload_document_metadata(application_id: int, document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    db_document = models.Document(**document.dict(), application_id=application_id)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@router.post('/{application_id}/review', response_model=schemas.LoanApplicationRead)
def submit_review_decision(application_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    officer = db.query(models.User).filter(models.User.id == review.officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail='Review officer not found')

    db_review = models.Review(**review.dict(), application_id=application_id)
    db.add(db_review)

    application.status = review.decision
    application.manual_review = review.decision in {'UNDER_REVIEW', 'MORE_INFO_REQUIRED'}
    db.add(models.StatusHistory(application_id=application.id, status=review.decision, note=review.remarks))
    db.commit()
    db.refresh(application)

    return schemas.LoanApplicationRead(**_application_payload(application))


@router.post('/{application_id}/request-more-info')
def request_more_information(application_id: int, payload: dict, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'MORE_INFO_REQUIRED'
    application.manual_review = True
    db.add(models.ApplicationNote(application_id=application.id, note_type='request-info', body=payload.get('message', 'More information requested')))
    db.add(models.StatusHistory(application_id=application.id, status='MORE_INFO_REQUIRED', note=payload.get('message', 'More information requested')))
    db.commit()
    return {'message': 'More information requested'}


@router.post('/{application_id}/approve')
def approve_application(application_id: int, payload: dict | None = None, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'APPROVED'
    application.manual_review = False
    db.add(models.StatusHistory(application_id=application.id, status='APPROVED', note=(payload or {}).get('message', 'Approved by officer')))
    db.commit()
    return {'message': 'Application approved'}


@router.post('/{application_id}/reject')
def reject_application(application_id: int, payload: dict | None = None, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'REJECTED'
    application.manual_review = False
    db.add(models.StatusHistory(application_id=application.id, status='REJECTED', note=(payload or {}).get('message', 'Rejected by officer')))
    db.commit()
    return {'message': 'Application rejected'}


@router.get('/analytics', response_model=schemas.AnalyticsResponse)
def analytics(db: Session = Depends(get_db)):
    total = db.query(func.count(models.LoanApplication.id)).scalar() or 0
    pending = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'PENDING').scalar() or 0
    under_review = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'UNDER_REVIEW').scalar() or 0
    approved = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'APPROVED').scalar() or 0
    rejected = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'REJECTED').scalar() or 0
    more_info_required = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'MORE_INFO_REQUIRED').scalar() or 0
    average_readiness = float(db.query(func.coalesce(func.avg(models.LoanApplication.readiness_score), 0)).scalar() or 0)
    average_credit = float(db.query(func.coalesce(func.avg(models.LoanApplication.credit_score), 0)).scalar() or 0)
    average_trust = float(db.query(func.coalesce(func.avg(models.LoanApplication.trust_score), 0)).scalar() or 0)

    return schemas.AnalyticsResponse(
        total_applications=total,
        pending=pending,
        under_review=under_review,
        approved=approved,
        rejected=rejected,
        more_info_required=more_info_required,
        average_readiness_score=round(average_readiness, 2),
        average_credit_score=round(average_credit, 2),
        average_trust_score=round(average_trust, 2),
        monthly_volume=[
            {'month': 'Oct', 'approved': 48, 'rejected': 9, 'volume': 5.1},
            {'month': 'Nov', 'approved': 51, 'rejected': 14, 'volume': 5.6},
            {'month': 'Dec', 'approved': 39, 'rejected': 8, 'volume': 4.0},
            {'month': 'Jan', 'approved': 58, 'rejected': 12, 'volume': 6.4},
            {'month': 'Feb', 'approved': 64, 'rejected': 10, 'volume': 7.2},
            {'month': 'Mar', 'approved': 71, 'rejected': 13, 'volume': 8.1},
        ],
        approval_trend=[
            {'month': 'Nov', 'approval': 74, 'firstTime': 66},
            {'month': 'Dec', 'approval': 78, 'firstTime': 70},
            {'month': 'Jan', 'approval': 80, 'firstTime': 74},
            {'month': 'Feb', 'approval': 84, 'firstTime': 78},
            {'month': 'Mar', 'approval': 87, 'firstTime': 82},
        ],
        loan_mix=[
            {'type': 'Education', 'value': 38, 'fill': 'var(--color-home)'},
            {'type': 'Personal', 'value': 22, 'fill': 'var(--color-auto)'},
            {'type': 'Business', 'value': 18, 'fill': 'var(--color-business)'},
            {'type': 'Auto', 'value': 14, 'fill': 'var(--color-education)'},
            {'type': 'Home', 'value': 8, 'fill': 'var(--color-other)'},
        ],
    )