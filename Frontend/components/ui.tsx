import { ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import {
  AlertSeverity,
  AppointmentStatus,
  DoctorAvailability,
  OrderStatus,
} from "@/lib/types";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={clsx("card", padded && "p-5", className)}>{children}</div>;
}

export function Modal({
  open,
  title,
  eyebrow,
  children,
  footer,
  onClose,
  size = "lg",
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
}) {
  if (!open) return null;

  const sizes = {
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={clsx(
          "relative w-full rounded-card border border-line bg-white shadow-lift",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
            <h2 id="modal-title" className="font-display text-xl text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-md border border-line text-ink-muted hover:bg-paper hover:text-ink inline-flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex items-center gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  description,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-line/80 pb-5 mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="font-display text-3xl leading-tight text-ink">{title}</h1>
        {description && <p className="text-sm leading-6 text-ink-muted mt-2 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const availabilityColor: Record<DoctorAvailability, string> = {
  Available: "bg-sage-400",
  Busy: "bg-clay-400",
  Off: "bg-ink-faint",
  "On Leave": "bg-alert-400",
};

export function AvailabilityDot({ status }: { status: DoctorAvailability }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <span className={clsx("status-dot", availabilityColor[status])} />
      {status}
    </span>
  );
}

const appointmentStyle: Record<AppointmentStatus, string> = {
  Scheduled: "bg-brand-50 text-brand-700",
  "Checked In": "bg-clay-50 text-clay-600",
  "In Consultation": "bg-brand-500 text-white",
  Completed: "bg-sage-50 text-sage-500",
  Cancelled: "bg-ink-faint/20 text-ink-muted",
  "No Show": "bg-alert-50 text-alert-500",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={clsx("badge", appointmentStyle[status])}>{status}</span>;
}

const orderStyle: Record<OrderStatus, string> = {
  Ordered: "bg-ink-faint/20 text-ink-soft",
  "Sample Collected": "bg-brand-50 text-brand-700",
  "In Progress": "bg-clay-50 text-clay-600",
  "Report Ready": "bg-sage-50 text-sage-500",
  Reviewed: "bg-brand-100 text-brand-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={clsx("badge", orderStyle[status])}>{status}</span>;
}

const severityStyle: Record<AlertSeverity, string> = {
  Critical: "bg-alert-50 text-alert-500",
  Warning: "bg-clay-50 text-clay-600",
  Info: "bg-brand-50 text-brand-700",
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return <span className={clsx("badge", severityStyle[severity])}>{severity}</span>;
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-brand-500 text-white ring-2 ring-white flex items-center justify-center font-semibold shrink-0 shadow-card"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="mb-4 h-10 w-10 rounded-md border border-line bg-paper" />
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "clay" | "alert" | "sage" }) {
  const tones: Record<string, string> = {
    neutral: "bg-paper text-ink-soft border border-line",
    brand: "bg-brand-50 text-brand-700",
    clay: "bg-clay-50 text-clay-600",
    alert: "bg-alert-50 text-alert-500",
    sage: "bg-sage-50 text-sage-500",
  };
  return <span className={clsx("badge", tones[tone])}>{children}</span>;
}
