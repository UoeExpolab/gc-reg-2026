import Link from "next/link";
import type { ReactNode } from "react";

type FormPageShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function FormPageShell({ eyebrow, title, children }: FormPageShellProps) {
  return (
    <main className="form-page">
      <div className="form-page-heading">
        <Link href="/" className="back-link">
          Back to forms
        </Link>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          Grand <em>Challenges</em>
        </h1>
        <div className="gold-rule" />
      </div>

      <div className="form-card">
        <div className="head">
          <div className="eyebrow">
            <span className="dash" />
            {title}
          </div>
          <h2>{title}</h2>
        </div>
        <div className="body">{children}</div>
      </div>
    </main>
  );
}
