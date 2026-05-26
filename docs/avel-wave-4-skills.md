# Avel Wave 4 Skills — Coverage, Gaps, Recommendations

> Wave 4 is the ship gate. Verdict, Proof, Warden, Launch, Beacon — these five agents decide whether anything ships to a real user.
> This doc maps modern Q&D territory, grades coverage, identifies gaps, and locks recommendations.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Five Wave 4 skills cover a 22-territory quality & deployment system. Coverage is strong on traditional QA, security, and deployment but has gaps on compliance, incident response, data retention, and capacity planning.

**Decision:** Keep the 5-skill roster. Strengthen existing skills to cover gaps rather than adding new ones. Add explicit Phase Zero ADR items for project-specific compliance requirements.

**Skills affected:** Warden (expands compliance scope), Verdict (gains incident response coordination), Beacon (adds data retention monitoring), Launch (adds capacity planning).

---

## Why Wave 4 Matters Most

Three forces make Wave 4 the most consequential team:

1. **It's the ship gate.** The other three waves can build anything. Wave 4 decides if it actually goes live.
2. **Mistakes are visible.** A frontend bug embarrasses. A backend bug leaks data. A Wave 4 failure takes the whole system down.
3. **It's where most teams fail.** The pattern is consistent: agencies build well, ship badly. Avel's Wave 4 is the competitive differentiator.

Five hard gates block ship: QA (Proof), Security (Warden), Deployment (Launch), Monitoring (Beacon with a tested alert), and tested Rollback (Launch). Verdict coordinates. Any gate failing blocks the sprint.

---

## The Full Quality & Deployment Territory in 2026

A modern production Q&D operation has 22 distinct concerns:

1. **Unit testing strategy** — coverage, what to test, what not to test
2. **Integration testing** — service-to-service, database-touching tests
3. **End-to-end testing** — full user flows in browser
4. **Visual regression testing** — UI doesn't drift unintentionally
5. **Load testing** — performance under expected and stress traffic
6. **Test data management** — fixtures, factories, seed data
7. **OWASP Top 10 audit** — standard security baseline
8. **Dependency vulnerability scanning** — known CVEs in packages
9. **Secret scanning** — preventing credentials in code
10. **Penetration testing** — adversarial testing of deployed system
11. **Compliance auditing** — SOC 2, HIPAA, GDPR, CCPA per project
12. **CI/CD pipeline design** — automated build, test, deploy
13. **Deployment execution** — blue-green, canary, rolling deploys
14. **Environment management** — dev, staging, production, secrets per env
15. **Infrastructure as code** — Terraform, Pulumi, deployment scripts
16. **Rollback procedures** — tested fallback when deploy fails
17. **Disaster recovery** — broader than rollback, full recovery scenarios
18. **Error tracking** — exception capture, alerting
19. **Uptime monitoring** — health checks, status pages
20. **Performance monitoring** — APM, query performance, frontend metrics
21. **Log aggregation** — centralized logging across services
22. **Incident response** — how to handle production issues when they hit

Every Avel client project touches at least 18 of these. SaaS projects touch all 22.

---

## Current Q&D Roster

| Skill | Role | Wave |
|---|---|---|
| **Verdict** | Quality LEAD — ship/no-ship decision | 4 |
| **Proof** | QA — testing, ship-blocking gate | 4 |
| **Warden** | Security — audit, ship-blocking gate | 4 |
| **Launch** | DevOps & Recovery — CI/CD, deploy, rollback (Refuge + Infra merged) | 4 |
| **Beacon** | Monitor — error tracking, uptime, performance, alerts | 4 |

---

## Coverage Map

| Territory | Current owner | Grade | Notes |
|---|---|---|---|
| Unit testing strategy | Proof | **A** | Clear ownership |
| Integration testing | Proof | **A** | Strong |
| End-to-end testing | Proof | **A** | Core competency |
| Visual regression | Proof | **A−** | Owned but tooling varies by stack |
| Load testing | Proof | **A** | Strong |
| Test data management | Proof | **B+** | Owned but easy to under-specify |
| OWASP Top 10 audit | Warden | **A** | Core competency |
| Dependency scanning | Warden | **A** | Strong |
| Secret scanning | Warden | **A** | Strong |
| Penetration testing | Warden + Red Team | **A** | Cross-team well-defined |
| **Compliance auditing** | **Gap** | **D** | Nobody owns SOC 2, HIPAA, GDPR, CCPA |
| CI/CD pipeline | Launch | **A** | Core competency |
| Deployment execution | Launch | **A** | Strong |
| Environment management | Launch | **A** | Strong |
| Infrastructure as code | Launch (Infra merged) | **A** | Solid |
| Rollback procedures | Launch (Refuge merged) | **A** | Critical and owned |
| **Disaster recovery** | **Partial — Launch** | **B−** | Rollback yes, broader DR no |
| Error tracking | Beacon | **A** | Strong |
| Uptime monitoring | Beacon | **A** | Strong |
| Performance monitoring | Beacon | **A** | Strong |
| Log aggregation | Beacon | **A** | Strong |
| **Incident response** | **Gap** | **D** | Failure protocols exist but no agent owns coordination |
| **Data retention** | **Gap** | **D** | GDPR Article 17 etc. — nobody owns |
| **Capacity planning** | **Gap** | **D** | When traffic exceeds infrastructure |

**Four real gaps:** compliance auditing, incident response coordination, data retention, capacity planning. Plus one partial: full disaster recovery beyond rollback.

---

## Eight Principles For Wave 4 Skills

These differ from backend and frontend principles in meaningful ways:

### 1. Wave 4 skills must be paranoid by professional necessity

Backend skills are paranoid about input. Wave 4 skills are paranoid about *everything else* — what if the test passes for the wrong reason, what if monitoring is the thing that's broken, what if rollback has never been tested, what if the staging environment isn't actually like production.

Every Wave 4 skill's first principle is verifying that verification mechanisms themselves work. Beacon's alert must be tested. Refuge's rollback must be tested. Proof's test suite must include tests that intentionally fail to verify the test infrastructure works.

### 2. Wave 4 skills produce non-negotiable verdicts

Other waves produce work that LEADs review and accept. Wave 4 produces VERDICTS. Either the gate passes or it doesn't. No "good enough." No "we'll fix it post-launch."

Each Wave 4 skill's Definition of Done has binary outcomes per check. Pass or fail. No partial credit. This is the discipline that separates Avel from agencies that ship and pray.

### 3. Wave 4 skills must work in production conditions

Frontend skills can verify locally. Backend skills can verify against test databases. Wave 4 skills must verify against *production-like* conditions — staging that mirrors production, real data shapes, real traffic patterns, real failure modes.

Every Wave 4 skill's Self-Verification section includes "did this run against staging, not just locally?"

### 4. Wave 4 skills coordinate more than other waves

Wave 4 inherits everything from Waves 2 and 3. Proof tests work from both teams. Warden audits both teams' code. Launch deploys everything. Beacon monitors everything.

This means Wave 4 LEADs (Verdict) need to coordinate across all previous waves, not just within Wave 4. Atlas and Zero hand off finished work; Verdict reviews the whole.

### 5. Wave 4 skills must produce runbooks, not just code

Other waves produce code. Wave 4 produces *operational artifacts*:
- Test suites that future runs use
- Security audit reports
- Deployment runbooks
- Rollback procedures
- Monitoring dashboards
- Incident response playbooks

These artifacts outlive the sprint. They're what makes the system maintainable.

### 6. Wave 4 skills must consider third-party dependencies failing

Backend skills consider what happens when database is slow. Wave 4 skills consider what happens when:
- Monitoring service is down
- CI/CD provider has an outage
- Cloud provider has a regional incident
- DNS resolution fails
- TLS certificate expires

Every Wave 4 skill's Common Failure Modes section includes meta-failures — failures of the verification or operational tools themselves.

### 7. Wave 4 skills produce post-incident learning

When something goes wrong in production, the failure protocol fires. But the post-incident review produces new knowledge — anti-patterns for the bank, new failure modes for skills, new monitoring thresholds.

Wave 4 skills are the primary contributors to Anti-Vibe-Coding Pattern knowledge. They see what failed and why.

### 8. Wave 4 skills must enforce data discipline

Wave 4 owns the long-term integrity of production data:
- Backups happen and are tested
- Soft deletes are honored
- Retention policies are followed
- Privacy compliance is real (not just claimed)
- PII is handled per project requirements

Most teams treat data discipline as someone else's job. Wave 4 makes it nobody's-else-job.

---

## Recommendations — How To Close The Gaps

### A. Warden expands to own compliance auditing

**Problem:** SOC 2, HIPAA, GDPR, CCPA — different frameworks, different requirements, no agent owns them.

**Solution:** Warden's scope expands to include compliance auditing for whichever framework applies to the project.

**Added to Warden's Definition of Done (when compliance is in scope):**

```markdown
### Compliance Audit (per project requirements)

If SOC 2:
- [ ] Access controls verified (who can access what)
- [ ] Audit logging confirmed for all sensitive operations
- [ ] Encryption at rest verified
- [ ] Encryption in transit verified
- [ ] Backup procedures verified
- [ ] Incident response plan documented

If HIPAA:
- [ ] PHI identified and inventoried
- [ ] Access controls for PHI verified
- [ ] PHI encryption (at rest + in transit) verified
- [ ] BAA (Business Associate Agreement) in place if relevant
- [ ] Audit logs preserve required information
- [ ] Breach notification procedures documented

If GDPR:
- [ ] Lawful basis for processing documented per data type
- [ ] Privacy policy reflects actual data handling
- [ ] Right to access implemented
- [ ] Right to erasure (Article 17) implemented
- [ ] Right to portability implemented
- [ ] Data Processing Agreement (DPA) with subprocessors verified
- [ ] Data Protection Impact Assessment if required

If CCPA:
- [ ] California consumer rights notice posted
- [ ] Opt-out of sale mechanism (if applicable)
- [ ] Data inventory of California residents' data
- [ ] Consumer request handling procedures documented
```

**Warden's references expand:**

```
warden/
├── SKILL.md
└── references/
    ├── owasp-top-10.md
    ├── dependency-scanning.md
    ├── secret-scanning.md
    ├── soc2-checklist.md           # NEW
    ├── hipaa-checklist.md          # NEW
    ├── gdpr-checklist.md           # NEW
    ├── ccpa-checklist.md           # NEW
    └── log.md
```

**Phase Zero addition:**

Helm decides at Phase Zero which compliance frameworks apply to the project. The decision is documented as an ADR. If any compliance framework is in scope, Warden's checklist for that framework is mandatory.

For projects with no compliance requirements (most B2B SaaS without enterprise customers): Warden focuses on OWASP and dependency scanning only.

### B. Verdict gains incident response coordination

**Problem:** The failure protocols document defines incident response steps. But no agent owns "during a production incident, this agent coordinates the response."

**Solution:** Verdict owns incident response coordination as an extension of the ship-gate role. The agent that decided to ship also coordinates response when ship-related issues arise.

**Added to Verdict's Definition of Done:**

```markdown
### Incident Response Readiness

- [ ] Incident response runbook included in sprint deliverables
- [ ] On-call coordination model documented (for solo Avel: founder is on-call)
- [ ] Escalation paths documented (who to contact for what kind of issue)
- [ ] Communication templates ready (status pages, client comms)
- [ ] Rollback procedure tested and documented
- [ ] Monitoring thresholds tuned to alert before user impact
```

**Verdict's references expand:**

```
verdict/
├── SKILL.md
└── references/
    ├── ship-decision-criteria.md
    ├── gate-failure-routing.md
    ├── incident-coordination.md         # NEW
    ├── incident-comms-templates.md      # NEW (matches failure protocols)
    └── log.md
```

Verdict's incident response role is **coordination**, not technical recovery. Technical recovery still falls to the team that owns the failing component. Verdict orchestrates: who fixes what, who communicates with the client, when to consider escalation paths.

### C. Beacon adds data retention monitoring

**Problem:** Data retention policies (GDPR right to erasure, customer data lifecycle, log retention) exist but nobody monitors compliance.

**Solution:** Beacon adds data retention monitoring to the monitoring suite.

**Added to Beacon's Definition of Done:**

```markdown
### Data Retention Monitoring (when applicable)

- [ ] Data retention policies documented per data type
- [ ] Automated deletion verified for time-bound retention (logs, sessions, expired tokens)
- [ ] User-requested deletion path verified (GDPR Article 17 compliance check)
- [ ] Backup retention vs. data retention reconciled (deleted data really deleted from backups)
- [ ] Audit log retention meets compliance requirements
- [ ] Monitoring alert if retention job fails
```

**Beacon's references expand:**

```
beacon/
├── SKILL.md
└── references/
    ├── monitoring-stack-decisions.md
    ├── alert-threshold-patterns.md
    ├── dashboard-design.md
    ├── data-retention-monitoring.md       # NEW
    ├── log-retention-patterns.md          # NEW
    └── log.md
```

For projects without compliance requirements: this becomes basic log retention monitoring. For compliance-bound projects: full retention discipline.

### D. Launch adds capacity planning

**Problem:** When does traffic exceed infrastructure? Nobody currently asks this. Result: surprise outages when growth happens.

**Solution:** Launch's scope expands to include capacity planning as part of infrastructure decisions.

**Added to Launch's Definition of Done:**

```markdown
### Capacity Planning

- [ ] Expected load documented (req/sec, concurrent users, data growth rate)
- [ ] Current infrastructure capacity documented (limits per service)
- [ ] Headroom verified (current capacity / expected load > 3x recommended)
- [ ] Scaling triggers identified (when to add capacity)
- [ ] Auto-scaling configured where appropriate
- [ ] Cost projections for expected growth documented
- [ ] Database connection pool sized for expected concurrency
- [ ] Rate limits set conservatively to prevent runaway costs
```

**Launch's references expand:**

```
launch/
├── SKILL.md
└── references/
    ├── ci-cd-pipeline-patterns.md
    ├── deployment-strategy-decisions.md
    ├── iac-patterns.md
    ├── rollback-procedure-patterns.md
    ├── secrets-management.md
    ├── capacity-planning-patterns.md      # NEW
    ├── auto-scaling-patterns.md           # NEW
    └── log.md
```

### E. Verdict gates explicitly check all four expanded scopes

**Problem:** Wave 4 sign-off needs to verify the new responsibilities are actually checked, not assumed.

**Solution:** Verdict's sign-off checklist explicitly verifies the expanded scopes.

**Updated Verdict sign-off:**

```markdown
## Wave 4 Sign-Off Verification

Verify each gate produced its required artifacts:

### QA (Proof)
- [ ] Full test suite passing (with output attached)
- [ ] E2E tests against staging passing
- [ ] Load test results (if applicable) documented
- [ ] Test data management documented

### Security (Warden)
- [ ] OWASP Top 10 audit complete
- [ ] Dependency scan clean of criticals
- [ ] Secret scan clean
- [ ] **Compliance audit complete (per Phase Zero requirements)**

### Deployment (Launch)
- [ ] CI/CD pipeline verified
- [ ] Production deployment successful
- [ ] **Capacity planning documented**
- [ ] Rollback procedure tested and documented

### Monitoring (Beacon)
- [ ] All four monitoring dimensions live (errors, uptime, performance, logs)
- [ ] Test alert fired and acknowledged
- [ ] **Data retention monitoring configured (if applicable)**
- [ ] Dashboards accessible

### Incident Response Readiness (Verdict)
- [ ] **Incident response runbook complete**
- [ ] Communication templates ready
- [ ] Escalation paths documented

If all checked: ship. If any unchecked: block until resolved.
```

### F. Phase Zero adds compliance scope decision

**Problem:** Compliance requirements vary per project. Without Phase Zero clarity, Warden doesn't know which framework to audit against.

**Solution:** Phase Zero intake includes compliance scope determination.

**Added to Phase Zero intake template:**

```markdown
## Compliance Scope

Check all that apply to this project:

- [ ] SOC 2 — Type I or Type II being pursued or maintained
- [ ] HIPAA — PHI is handled
- [ ] GDPR — EU users or EU operations
- [ ] CCPA — California residents' data
- [ ] PCI-DSS — payment card data handled directly (rare with Stripe)
- [ ] FERPA — student education records
- [ ] SOX — public company financial reporting
- [ ] Industry-specific — [specify]

For each checked: Warden's compliance checklist for that framework applies.

If none checked: Warden focuses on OWASP and dependency scanning only.

This determines:
- Warden's checklist scope
- Beacon's data retention monitoring requirements
- Gate's auth depth (e.g., HIPAA requires audit logging on all PHI access)
- Phase Zero ADR for data handling decisions
```

---

## Two Wave 4 Verification Scripts Worth Adding

Wave 4 benefits more from scripts than other waves because verification is mostly mechanical.

### `proof/scripts/run-full-test-suite.py`

**Input:** test runner command, optional environment variables
**Output:** structured report of test results — counts, failures, timing, coverage

**Why:** Test results are mechanical. A script ensures Verdict's sign-off always references the same format of results.

### `warden/scripts/run-security-suite.py`

**Input:** project root, framework checklist (per Phase Zero compliance ADR)
**Output:** OWASP audit results + dependency scan results + secret scan results + framework-specific checklist results

**Why:** Security verification spans multiple tools. A script orchestrates the runs and produces a unified report.

Both scripts produce JSON output that gets attached to completion reports.

---

## Updated Wave 4 Skills — Summary

| Skill | Changes |
|---|---|
| **Verdict** | Adds incident response coordination. Sign-off explicitly verifies expanded scopes. References expand with incident coordination patterns. |
| **Proof** | Unchanged. Adds `run-full-test-suite.py` script. |
| **Warden** | Adds compliance auditing per Phase Zero requirements. References expand with framework checklists. Adds `run-security-suite.py` script. |
| **Launch** | Adds capacity planning. References expand with capacity and auto-scaling patterns. |
| **Beacon** | Adds data retention monitoring. References expand with retention patterns. |

Plus:

- **Phase Zero** adds compliance scope determination
- **avel-standards** adds `references/wave-4-dod-template.md` as shared baseline

---

## File Count Impact

Before this restructure: ~5 SKILL.md files + ~6 reference files = 11 files for Wave 4.

After: 5 SKILL.md files + 16 reference files + 2 scripts = 23 files for Wave 4.

Tradeoff: more files, but each is focused. Progressive disclosure means Claude loads only the ones relevant to current work. SKILL.md bodies stay under 150 lines each.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Wave 4 roster size | 5 skills — keep, don't add |
| Compliance ownership | Warden, with Phase Zero deciding scope per project |
| Incident response | Verdict coordinates, technical recovery stays with originating team |
| Data retention monitoring | Beacon, when applicable per project compliance |
| Capacity planning | Launch, mandatory for production deployment |
| Wave 4 sign-off | Verdict explicitly verifies all expanded scopes |
| Compliance frameworks supported | SOC 2, HIPAA, GDPR, CCPA, PCI-DSS, FERPA, SOX — frameworks added as needed |
| Verification scripts | 2 — `run-full-test-suite.py`, `run-security-suite.py` |
| Phase Zero addition | Compliance scope determination |
| Q&D-specific DoD template | In `avel-standards/references/` |

---

## What This Doesn't Cover

Explicitly out of scope for Wave 4 skills at this time:

- **Native mobile testing** — Avel doesn't ship native mobile in v1; if it does, Proof gets a mobile pack
- **Chaos engineering** — deliberate failure injection. Worth adding once Avel has multi-region deployments.
- **Multi-region failover** — single-region deployments only at launch. Add when Enterprise tier demands it.
- **Distributed tracing** — Beacon's territory but not implemented until needed
- **Blue-green at scale** — Launch handles basic blue-green; advanced patterns come with bigger clients
- **PII discovery and classification** — manually documented in Phase Zero now. Automated tooling later.

These are deliberate boundaries. Wave 4 v1 focuses on what every Avel sprint actually needs.

---

## The Honest Read

Wave 4 is now structurally sound. Five agents, clear ownership, gaps closed through scope expansion and Phase Zero ADRs rather than new skills.

Risk to watch: compliance work is new territory for Warden. The first sprint that requires real compliance auditing (HIPAA, SOC 2) will reveal whether the checklists are sufficient. Mitigation: start with projects that don't require compliance for first 2-3 sprints. Build the framework's compliance muscle before promising it to clients.

This Wave 4 structure is what Avel ships with.
