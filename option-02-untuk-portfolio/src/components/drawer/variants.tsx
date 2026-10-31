import { ArrowRight, ArrowUpRight, Eye } from 'lucide-react';
import type { DisasterEvent } from '../../types/disaster';
import { MONITORING_LABEL, SEVERITY_LABEL, STATUS_META } from '../../lib/status';
import { getDonateAction, getReportAction } from '../../lib/actions';
import { formatCount } from '../../lib/format';
import {
  CampaignNote,
  DetailHeading,
  DrawerFrame,
  ExternalActionLink,
  ImpactStats,
  ProgressBar,
  ResponseBlock,
  SimulationNotice,
  SourceNote,
} from './parts';

/** Prototype stand-in for pages that are not built yet. Receives a human-readable intent. */
export type PrototypeAction = (message: string) => void;

interface VariantProps {
  event: DisasterEvent;
  /** Status tag + close button, rendered at the top of the scroll area. */
  top: React.ReactNode;
  onAction: PrototypeAction;
}

function prototypeLink(onAction: PrototypeAction, message: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    onAction(message);
  };
}

/**
 * Once a campaign has closed there is nothing to donate to: point to the
 * published report if there is one, otherwise to the (future) response page.
 */
function ClosedCampaignAction({ event, onAction }: { event: DisasterEvent; onAction: PrototypeAction }) {
  const report = getReportAction(event);
  if (report) return <ExternalActionLink action={report} variant="secondary" />;
  return (
    <a
      href="#"
      className="btn btn--secondary btn--block"
      onClick={prototypeLink(onAction, 'Prototype — response pages are not built yet.')}
    >
      View Response <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}

/* ───────────── Active response ───────────── */

export function ActiveResponseDetail({ event, top, onAction }: VariantProps) {
  const donate = getDonateAction(event);
  const isClosed = event.fundraisingStatus === 'closed';

  return (
    <DrawerFrame
      top={top}
      footer={
        <div className="detail-actions">
          {donate && <ExternalActionLink action={donate} />}
          {isClosed ? (
            <ClosedCampaignAction event={event} onAction={onAction} />
          ) : (
            <a
              href="#"
              className={donate ? 'btn btn--text' : 'btn btn--secondary btn--block'}
              onClick={prototypeLink(onAction, 'Prototype — the full situation page is not built yet.')}
            >
              View Details <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
        </div>
      }
    >
      <SimulationNotice event={event} />
      <DetailHeading event={event} />
      <ImpactStats event={event} />
      <ResponseBlock event={event} />
      <CampaignNote event={event} />
      <SourceNote event={event} />
    </DrawerFrame>
  );
}

/* ───────────── Alert: informative only — deliberately no donate CTA ───────────── */

export function AlertDetail({ event, top, onAction }: VariantProps) {
  return (
    <DrawerFrame
      top={top}
      footer={
        <div className="detail-actions">
          <a
            href="#"
            className="btn btn--secondary btn--block"
            onClick={prototypeLink(onAction, 'Prototype — situation updates page is not built yet.')}
          >
            View Situation <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      }
    >
      <DetailHeading event={event} />
      <dl className="facts">
        <div>
          <dt>Status</dt>
          <dd>
            <span className="facts__status">
              <span className="facts__dot" aria-hidden="true" />
              {MONITORING_LABEL[event.monitoringStatus ?? 'monitoring']}
            </span>
          </dd>
        </div>
        {event.severity && (
          <div>
            <dt>Severity</dt>
            <dd>{SEVERITY_LABEL[event.severity]}</dd>
          </div>
        )}
        {event.affectedPeople != null && (
          <div>
            <dt>Reported affected</dt>
            <dd>{formatCount(event.affectedPeople)} people</dd>
          </div>
        )}
        {event.displacedPeople != null && event.displacedPeople > 0 && (
          <div>
            <dt>Displaced</dt>
            <dd>{formatCount(event.displacedPeople)} people</dd>
          </div>
        )}
      </dl>
      <p className="detail-copy">{event.description}</p>
      <div className="monitor-note">
        <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
        <div>
          <p className="monitor-note__title">Rangkul is monitoring the situation.</p>
          <p className="monitor-note__body">
            There is no Rangkul response or fundraising for this event yet. If our team is
            deployed, this page will show how you can help.
          </p>
        </div>
      </div>
      <SourceNote event={event} />
    </DrawerFrame>
  );
}

/* ───────────── Recovery: emergency over, recovery work continues ───────────── */

export function RecoveryDetail({ event, top, onAction }: VariantProps) {
  const donate = getDonateAction(event);
  const isClosed = event.fundraisingStatus === 'closed';
  const progress = event.recoveryProgress;
  const programLink = event.relatedProgram && (
    <a
      href={event.relatedProgram.url}
      className={donate || isClosed ? 'btn btn--text' : 'btn btn--secondary btn--block'}
      onClick={prototypeLink(onAction, 'Prototype — program pages are not built yet.')}
    >
      Explore the program <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );

  return (
    <DrawerFrame
      top={top}
      footer={
        <div className="detail-actions">
          {donate && <ExternalActionLink action={donate} />}
          {isClosed && <ClosedCampaignAction event={event} onAction={onAction} />}
          {programLink}
        </div>
      }
    >
      <SimulationNotice event={event} />
      <DetailHeading event={event} />
      <section className="recovery" aria-labelledby={`${event.id}-recovery`}>
        <h3 id={`${event.id}-recovery`} className="section-label">
          {progress != null ? 'Recovery progress' : 'Recovery'}
        </h3>
        {progress != null && (
          <>
            <p className="recovery__figure">
              {progress}%<span>{event.recoveryPhase ? `Phase · ${event.recoveryPhase}` : 'In progress'}</span>
            </p>
            <ProgressBar value={progress} tone="recovery" label={`Recovery ${progress}% complete`} />
          </>
        )}
        {progress == null && event.recoveryPhase && (
          <p className="recovery__phase">Phase · {event.recoveryPhase}</p>
        )}
        <p className="recovery__lead">{STATUS_META.recovery.description}</p>
        <p className="detail-copy">{event.description}</p>
      </section>
      <ResponseBlock event={event} title={isClosed ? 'How Rangkul helped' : 'How Rangkul is helping'} />
      {event.relatedProgram && (
        <section className="program" aria-labelledby={`${event.id}-program`}>
          <h3 id={`${event.id}-program`} className="section-label">
            Related program
          </h3>
          <p className="program__name">{event.relatedProgram.name}</p>
          <p className="program__body">{event.relatedProgram.description}</p>
        </section>
      )}
      <CampaignNote event={event} />
      <SourceNote event={event} />
    </DrawerFrame>
  );
}

/* ───────────── Resolved: historical record, report link only ───────────── */

export function ResolvedDetail({ event, top }: VariantProps) {
  const report = getReportAction(event);
  return (
    <DrawerFrame
      top={top}
      footer={
        report && (
          <div className="detail-actions">
            <ExternalActionLink action={report} variant="secondary" />
          </div>
        )
      }
    >
      <DetailHeading event={event} />
      <p className="detail-copy">{event.description}</p>
      <ResponseBlock event={event} title="How Rangkul helped" />
      <SourceNote event={event} />
    </DrawerFrame>
  );
}
