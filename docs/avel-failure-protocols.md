# Avel Failure Mode Protocols

> What to do when things go wrong. Five scenarios with documented protocols.
> Solo founder + AI-assisted dev firm means failure modes are different from traditional agencies. These protocols are designed for Avel specifically.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Five failure modes documented with full protocols:

1. **Sprint abort** — when a sprint goes truly sideways and continuing makes things worse
2. **Client ghost** — when a client stops responding mid-sprint
3. **Gate failure recovery** — when QA or Security blocks ship and the work needs rework
4. **Production incident** — when something breaks badly post-deploy
5. **Founder unavailable** — when you can't operate Avel (illness, emergency, travel)

Each protocol covers: trigger conditions, immediate actions, communication, recovery steps, documentation requirements, and post-incident review.

These protocols are documented BEFORE first paying client so you don't invent them under pressure.

---

## Why These Protocols Matter

Three forces make failure protocols critical for Avel:

1. **Solo founder.** No team backstop. If you don't have a plan, the plan is "panic and improvise."
2. **AI-assisted work.** Speed creates new failure modes — things break faster, in different ways, than traditional dev work.
3. **Productized model.** Fixed-price sprints mean failures hit margin directly. Time spent in crisis is unbillable.

The cost of a bad failure response is high. The cost of having a protocol is one document. Worth writing.

**Discipline rule:** When a failure happens, read the protocol. Don't improvise. The protocol exists because past-you (calm, thinking clearly) knew better than present-you (stressed, reactive).

---

# Protocol 1: Sprint Abort

## What this covers

A sprint that cannot be completed as scoped. Continuing would damage Avel's quality standards, client relationship, or financial position more than aborting.

## Trigger conditions

Sprint abort fires when ANY of the following are true:

- **Architectural discovery mid-sprint.** Wave 2 or Wave 3 reveals the planned approach is fundamentally wrong. Continuing requires significant scope expansion or starting over.
- **Repeated gate failures.** Proof or Warden blocks ship 3 times on the same issue without resolution.
- **Client scope explosion.** Mid-sprint, client demands changes that double the scope and refuse the change-request protocol.
- **Technical impossibility surfaces.** Something planned at Phase Zero turns out to be impossible given the constraints (e.g., third-party API doesn't support a critical operation).
- **Founder cannot continue.** Illness, family emergency, or other personal reason extends past 5 business days.

## Immediate actions (within 4 hours of trigger)

1. **Stop work.** All agent activations halt. No new commits to client repo.
2. **Document the trigger.** Write a one-page sprint-abort report including:
   - What specifically triggered the abort
   - What's been completed (with verification)
   - What's incomplete
   - The realistic options going forward
3. **Notify client.** Phone call first, then written summary. Use the abort communication template (below).
4. **Pause billing.** Do not invoice the final 50%. Do not issue refunds yet.
5. **Document for retrospective.** This will go in the knowledge bank as an anti-pattern.

## Communication to the client

Template:

```
Subject: [Project name] — important update

Hi [name],

I need to let you know we've hit a significant issue with [project name] that
changes the path forward.

What happened:
[One sentence on the trigger — be honest, be specific, no jargon]

What this means:
[One sentence on the impact to the original scope]

Three options going forward:

1. [Reduced scope option] — finish what's possible, ship a smaller version
2. [Reset option] — restart with a revised approach, new timeline, possibly
   adjusted budget
3. [Pause option] — pause this engagement, refund the unworked portion of
   the upfront, revisit later

I want to talk through these with you tomorrow. Are you free at [time]?

— [Name]
```

The communication must be:
- Within 24 hours of trigger
- Verbal first (phone or video call), written follow-up
- Honest about what went wrong
- Offering options, not asking permission
- Not apologetic to the point of self-flagellation (you're a vendor making a tough call, not a junior asking for forgiveness)

## Recovery paths

Three structured paths after the client conversation:

### Path A: Reduced scope

Ship what works. Document what was descoped. Adjust the final invoice to reflect actual delivery. Client gets less than promised but gets something.

When to use: significant progress was made, partial value is real.

Billing: invoice for delivered scope (typically 50-75% of total). No final invoice if 50% upfront covers the work done.

### Path B: Reset with revised scope

Treat it as a new sprint. Phase Zero again. New brief, new pricing, new timeline. The original sprint closes as a partial.

When to use: the original approach was wrong but the goal is achievable.

Billing: keep the 50% upfront as covering Phase Zero work + completed pieces. New sprint quoted fresh.

### Path C: Pause and refund

Some portion of the 50% upfront covers work done. The rest is refunded. Sprint closes as aborted. Possible to resume in future as a new engagement.

When to use: the project genuinely can't be completed under any reasonable approach.

Billing: invoice for verifiable work done (typically 10-30% of total upfront). Refund the rest within 14 days.

## Documentation requirements

After abort, produce:

- Sprint abort report (1-2 pages)
- Anti-pattern entry in knowledge bank covering what went wrong
- ADR documenting the architectural issue (if applicable)
- Updated retrospective covering lessons learned
- Email summary to client confirming the chosen path and next steps

## Post-incident review

Within 7 days, ask yourself:

- What signal could have caught this in Phase Zero?
- What changes to the sprint brief template would prevent this?
- Was a standards layer violated? (Universal, team, agent, project)
- Should the framework's gates be tighter?

Update the framework accordingly. Sprint aborts are the framework's most valuable feedback.

## What an abort does NOT mean

- Refund of 100% (you did real work)
- Ban on working with that client again
- Public discussion of the failure
- Self-flagellation

Aborts happen. Professional vendors handle them professionally. Avel's brand is enhanced by handling aborts well, not damaged by aborts happening.

---

# Protocol 2: Client Ghost

## What this covers

A client who stops responding during an active engagement. Communications go unanswered. Decisions can't be made. Sprint can't progress.

## Trigger conditions

Client ghost protocol fires when ALL of the following are true:

- Client has not responded to a direct ask within 5 business days
- Multiple channels tried (email, phone, project comms tool)
- The lack of response is blocking sprint progress
- This is not an expected absence (vacation, holiday, communicated in advance)

## Immediate actions

### Day 5 of silence — first contact

Send a polite check-in:

```
Subject: [Project name] — quick check-in

Hi [name],

Following up on my [previous communication] from [date]. We need [specific
decision/input] to continue with [specific work].

Are you available for a 15-minute call this week to resolve this?

If timing is bad, just send me a quick reply so I know you got this.

— [Name]
```

### Day 10 of silence — formal notice

Send a more formal notice:

```
Subject: [Project name] — sprint paused pending your response

Hi [name],

I haven't heard back since [date]. Without [specific input], I can't move
forward with [specific work].

I'm pausing active work on [project name] as of today.

Per our agreement, the sprint timeline pauses until we resume. The original
delivery date will shift accordingly.

If you'd like to continue, please reply by [date 5 business days from now].
If I don't hear from you by then, I'll consider the sprint suspended.

— [Name]
```

### Day 15 of silence — suspension

Sprint is suspended. Send final notice:

```
Subject: [Project name] — sprint suspended

Hi [name],

Without response by [previous deadline], I'm suspending the [project name]
sprint as of today.

What this means:
- Active work has stopped
- The 50% upfront covers Phase Zero work + work completed through [date]
- To resume, we'd need to:
  - Reconnect on a call to confirm scope and timeline
  - Sign a sprint resumption agreement
  - Pay any remaining work-completed balance

If you'd like to resume in the future, just reach out. The work done so
far is yours — repository access, documentation, etc. remain available.

— [Name]
```

## Communication during the silence

Document everything:
- Date and channel of each attempted contact
- Exact message sent
- Time of attempted phone calls
- Read receipts if visible

Keep all communications professional. Never accusatory. Ghosting may be illness, family emergency, business crisis, or genuine disinterest. Treat all cases the same way until you know otherwise.

## Financial implications

The 50% upfront covers:
- Phase Zero work (always)
- Wave 1 planning (always)
- Whatever was completed before silence began

Refund considerations:
- If upfront ($X) exceeds work done, the difference is refundable per the contract
- If work done exceeds upfront, you eat the difference (but this is rare with 50% upfront discipline)
- Default policy: keep upfront for work completed, no refund unless work done is significantly less than 50%

## When the client comes back

If a ghosted client returns after suspension:

1. Don't be punitive. Greet professionally.
2. Confirm whether they want to resume or close.
3. If resume: new Phase Zero discovery to re-scope. New brief. New 50% upfront for remaining work. New timeline.
4. If close: confirm final state, send delivery summary, archive engagement.

A ghost is not a banned client. Some return for the right reasons. Stay professional.

## Documentation requirements

Per ghosted sprint:

- Communication log (dates, channels, content)
- Sprint suspension report
- Final state of work documented
- Updated client record with "ghost" status flag for tracking patterns

## Post-incident review

After ghost incident:

- Was there a signal during Phase Zero that this client might ghost? (Vague answers, slow responses pre-signature, unclear decision-maker)
- Should the Phase Zero red-flag checklist be updated?
- Was the original brief specific enough that a ghost can't dispute scope?

Update Phase Zero intake to catch similar patterns earlier.

---

# Protocol 3: Gate Failure Recovery

## What this covers

Wave 4 gates (QA, Security, Deploy, Monitoring, Rollback) blocking sprint close. The work isn't ready. Decision needed on how to recover.

## Trigger conditions

Gate failure protocol fires when:

- **Proof blocks** on a P0 or P1 test failure
- **Warden blocks** on a critical security finding
- **Launch fails** post-deploy verification (error rate spike, latency regression, health check failures)
- **Beacon's test alert** fails to deliver
- **Refuge's rollback test** fails or can't complete

## Immediate actions

1. **Halt forward progress.** No further Wave 4 work until current gate is resolved.
2. **Identify the responsible team.** QA fails route to whichever team built the failing component. Security fails route the same way. Deploy/monitoring/rollback fails route to Launch and the team that owns the affected territory.
3. **Document the failure.** Specific test name, specific finding, exact error, environment.
4. **Estimate remediation cost.** Hours to fix + retest cycle.

## Decision: how to recover

Three paths based on remediation cost and timeline:

### Path A: Fix in current sprint (≤16 hours remediation)

Standard recovery. Send work back to responsible team. Fix. Retest. Re-audit. Continue Wave 4.

- Team responsible for the failure addresses it
- After fix, Wave 4 restarts from Proof (re-test required because the fix may have introduced new issues)
- Original sprint timeline shifts by remediation time
- No client communication unless timeline shifts > 24 hours

### Path B: Descope and ship (16-40 hours of remediation needed)

Remove the failing feature from scope. Ship the rest. Document the descoped item for next sprint.

- Discuss with client before deciding
- Reduce final invoice by descoped portion's value (typically 10-25%)
- Descoped feature becomes a candidate for next sprint or change request

### Path C: Sprint abort (>40 hours remediation needed)

The gate failure reveals fundamental issues that can't be fixed within sprint timeline. Trigger Sprint Abort protocol (Protocol 1).

## Communication to the client

For Path A (in-sprint fix):

```
Subject: [Project name] — quick scope update

Hi [name],

Quick update: during QA, we found [specific issue, in plain English].
We're fixing it now. Delivery shifts by [N] days.

New target: [date].

— [Name]
```

Only send if delay > 24 hours.

For Path B (descope):

```
Subject: [Project name] — decision needed

Hi [name],

During QA we found that [specific feature] has [specific issue].
Two options:

1. Fix it in this sprint — delays delivery by [N] days
2. Ship without it — delivery on time, [feature] added in next sprint

Which works better for you? Happy to talk it through if helpful.

— [Name]
```

For Path C: use Sprint Abort communication template.

## Re-testing requirement

After ANY fix from a gate failure:

- Proof re-runs full test suite (not just the failed test)
- Warden re-audits if security-adjacent
- Launch redeploys to staging and re-runs verification
- Wave 4 sign-off requires all gates pass again

This is non-negotiable. Partial re-testing is how regressions ship.

## Documentation requirements

Per gate failure:

- Gate failure report (what failed, why, how fixed)
- Anti-pattern entry if the failure represents a systemic issue
- Updated agent log for the agent that introduced the failure (informs future activations)
- Updated Common Failure Modes section in relevant agent skill if recurring pattern

## Post-incident review

Within retrospective:

- Was the failure preventable with stricter Definition of Done?
- Did the responsible agent's Self-Verification section catch it (or should have)?
- Should Common Failure Modes for that agent be updated?
- Is there a pattern to add to the knowledge bank?

Gate failures are the framework's quality feedback loop. They're not embarrassments — they're inputs.

---

# Protocol 4: Production Incident

## What this covers

Something breaks badly post-deploy. Could be:
- Production application throwing errors at significant rate
- Database in degraded state
- Third-party integration failing
- Security incident discovered post-launch
- Performance regression severe enough to break user experience

## Trigger conditions

Production incident protocol fires when ANY of:

- Error rate above 5% sustained over 10+ minutes
- Health check failing for 5+ minutes
- Active client report of broken core functionality
- Security incident or potential data breach signal
- Database or critical service unavailable

## Severity classification

Within 5 minutes of detection, classify severity:

| Level | Definition | Response time |
|---|---|---|
| **P0** | Production down, data loss possible, security incident | Immediate (within 30 min) |
| **P1** | Major feature broken, many users affected | Within 2 hours |
| **P2** | Minor feature broken, some users affected | Within 24 hours |
| **P3** | Cosmetic or rare-condition issue | Within 7 days, next sprint |

## Immediate actions (P0 — first 30 minutes)

1. **Acknowledge the alert.** Confirm you've seen it (auto-acknowledgment via PagerDuty, Beacon, or manual)
2. **Assess scope.** What's broken? For whom? How widely?
3. **Decide: stabilize first or investigate first?**
   - If stabilization is obvious (rollback to last good version), do it
   - If investigation is needed, set 15-minute investigation budget before deciding
4. **Communicate.** Internal first (status page if exists, or just your notes). Client next if user-facing impact.
5. **Begin recovery.** Either rollback per Refuge's runbook, or hot-fix forward.

## Immediate actions (P1 — first 2 hours)

1. Acknowledge alert
2. Assess and confirm severity
3. Investigate root cause
4. Decide recovery path (fix forward vs. rollback)
5. Communicate to client within 1 hour
6. Execute fix or rollback
7. Verify resolution
8. Communicate resolution to client

## The rollback decision

If rollback is available (Refuge has documented and tested it), trigger criteria:

- **Roll back if:** issue is in newly-deployed code, time-to-fix-forward is unclear, user impact is high
- **Fix forward if:** rollback would lose data, issue is in third-party service, fix is obvious and quick

When in doubt, roll back. The rollback procedure exists precisely for these moments.

## Communication to the client

For P0/P1, within 1 hour of detection:

```
Subject: [Project name] — production issue

Hi [name],

Quick heads up: we detected an issue with [project name] at [time].

What's affected: [specific functionality]
What we're doing: [specific action — rollback, fix, investigation]
ETA: [realistic estimate, conservative]

I'll update you again [time].

— [Name]
```

Follow up at 30-60 minute intervals until resolved. Be specific about what's known and unknown.

For P2/P3, communicate within 24 hours with full diagnostic and fix plan.

## After resolution

Within 24 hours of incident resolution:

1. **Post-mortem document** (1-2 pages):
   - Timeline of detection, response, resolution
   - Root cause
   - Customer impact (downtime, users affected)
   - What worked, what didn't
   - Prevention plan

2. **Client communication** with post-mortem summary (sanitized as needed):

```
Subject: [Project name] — incident post-mortem

Hi [name],

The issue from [date] has been fully resolved as of [time].

What happened:
[Plain English summary, 1 paragraph]

Total impact:
- Detection to resolution: [duration]
- Affected users: [number or range]
- Data loss: [yes/no, details if yes]

What we changed to prevent recurrence:
[Specific actions taken]

Full details available if you'd like them. Otherwise, we're back to normal.

— [Name]
```

3. **Update Knowledge Bank** with anti-pattern entry covering the failure mode

4. **Update agent Common Failure Modes** for whichever agent's territory the failure touched

## Documentation requirements

Per incident:

- Timeline log (timestamps of detection, decisions, actions, resolution)
- Root cause analysis
- Post-mortem document
- Communication log to client
- Knowledge bank updates
- Updated runbook (Refuge's documentation) if rollback or recovery process needs improvement

## Post-incident review

Within 7 days:

- Was monitoring (Beacon) sufficient to detect this quickly?
- Was the rollback procedure (Refuge) tested for this scenario?
- Did Wave 4 gates miss something that would have caught this?
- Should the standards (Layer 1, 2, 3) be updated?

Production incidents are expensive. Every one should produce framework improvements.

## Special case: security incident

If the incident is security-related (breach, exposed data, exploited vulnerability):

- **Treat as P0 regardless of immediate user impact**
- **Notify client within 1 hour** even if details are incomplete
- **Document carefully** — this may have legal implications
- **Consider legal counsel** if data breach involves user PII
- **Follow disclosure laws** for the client's jurisdiction (GDPR, CCPA, state notification laws)

Security incidents require a separate, more careful protocol that's worth developing once you have specific compliance contexts. For now: notify, document, contain, consult lawyer.

---

# Protocol 5: Founder Unavailable

## What this covers

You can't operate Avel. Illness, family emergency, travel without connectivity, unexpected life event. Active client work continues to need attention.

This is the protocol most solo founders skip. Don't skip it.

## Trigger conditions

Founder unavailability protocol fires when:

- You expect to be unavailable for 5+ business days, OR
- You're unexpectedly unavailable for 3+ business days, OR
- A medical/family situation makes return uncertain

## Pre-incident setup (do this BEFORE you need it)

This is the work to do during your first month of Avel, before clients exist.

### Trusted contact

Identify ONE person who can act on your behalf in an emergency. Criteria:
- Available by phone reliably
- Capable of executing simple business operations
- Trustworthy with access to client data
- Probably: family member, longtime friend, or attorney
- NOT: business competitor, employee of a current/future client, online-only acquaintance

Once identified:

- Brief them on Avel's basic operation
- Share an emergency contact card (see below)
- Quarterly check-in to confirm they're still willing and reachable
- Update if anything material changes

### Emergency contact card

Single physical card (or digital equivalent in their password manager):

```
AVEL EMERGENCY CONTACT CARD

If Javaris is unavailable for 5+ business days, you have authority to act
on Avel's behalf per this document.

ACTIVE CLIENTS (as of [date]):
[List, updated quarterly]

WHAT TO DO IMMEDIATELY:
1. Contact each active client within 48 hours
2. Use the email template below
3. Notify Javaris's lawyer: [name, phone]
4. Notify Javaris's accountant: [name, phone]

ACCESS:
- Password manager: [1Password / Bitwarden] vault "Avel-Emergency"
- Master password is in [secure location, you've been told separately]
- Repository access: github.com/avelcore/[client repos listed]
- Banking: [bank name], login in password vault
- Domain: [registrar name], login in password vault

CLIENT EMAIL TEMPLATE:
"Hi [name], I'm [trusted contact name], reaching out on behalf of Javaris
Tavel at Avel. Due to an unexpected situation, Javaris is temporarily
unavailable. Your project [name] is in [status]. We'll have more info
within [timeline]. Please reply if anything urgent is needed."

DECISION AUTHORITY (in order):
1. Pause all client work until Javaris returns
2. If pause exceeds 14 days: notify clients of need to extend timeline
3. If pause exceeds 30 days: consult lawyer about formal sprint suspensions
4. DO NOT: hire contractors, sign new contracts, refund payments without
   lawyer consultation

LAWYER: [name, firm, phone, email]
ACCOUNTANT: [name, phone, email]
INSURANCE: [provider, policy number, claims phone]
```

### Documentation locations

Maintain a single secure source for:

- **Password manager** (1Password or Bitwarden) with vault "Avel-Emergency"
  - All login credentials for Avel infrastructure
  - Backup codes for 2FA
  - SSH keys (or pointer to where they're stored)
- **Document folder** (encrypted cloud or secure physical):
  - Latest emergency contact card
  - LLC operating agreement
  - Insurance policies
  - Active client list and contact info
  - Active engagement summaries (one paragraph per client)
- **Lawyer's office** (physical or digital):
  - Original legal documents
  - Succession plan signed copy
  - Operating agreement

### Quarterly review

Set a recurring quarterly task:
- Update active client list
- Update active engagement summaries
- Verify trusted contact is still reachable
- Verify password manager access works
- Verify all infrastructure logins are current
- Update emergency contact card if anything changed

## Immediate actions during unavailability

If unavailable suddenly (illness, emergency):

1. **Contact trusted person immediately** if at all possible
2. **They activate the protocol** using the emergency contact card
3. **You communicate as soon as physically able** even briefly

If unavailability is planned (extended travel, planned medical):

1. **Activate the protocol proactively** 1 week before
2. **Notify active clients in advance** of reduced availability
3. **Trusted contact is prepped** to handle issues
4. **Set up auto-responder** with clear expectations

## What gets paused vs. continues

During unavailability:

**Paused:**
- New sprint dispatch
- Phase Zero intake calls
- Active sprint work (Waves 2-4)
- Sales outreach
- Marketing posts
- Most client communications

**Continues (if possible):**
- Monitoring alerts (Beacon dashboards, automated)
- Critical production incident response (only if trusted contact has technical capability)
- Existing scheduled emails (newsletter, etc.)
- Auto-billing for completed work (if set up)

If trusted contact is non-technical, production incidents may need to wait or be handed to a backup technical contact (contractor on retainer, etc.).

## Communication template — client email during founder unavailability

Sent by trusted contact, with founder's approval if possible:

```
Subject: [Project name] — update on availability

Hi [name],

Reaching out because of an unexpected situation. Javaris is temporarily
unavailable through approximately [date].

Status of [project name]:
- Currently: [specific state — e.g., "Wave 3 in progress, paused at Vault completion"]
- Already delivered: [list]
- Pending: [list]
- Timeline impact: [new estimated delivery date or "to be determined"]

What we're doing:
- Work is paused until Javaris returns
- Your repository remains accessible: [link]
- Monitoring continues: [link]
- If urgent issues arise, please reply to this email

We'll send another update [timeline].

Apologies for the inconvenience.

— [Trusted contact name], on behalf of Javaris and Avel
```

## Financial implications

During extended unavailability:

- Auto-billing for completed work continues (Stripe subscriptions, etc.)
- New invoices pause
- Refunds for unworked portions of upfronts: lawyer consults needed
- Operating expenses (subscriptions, hosting) continue from existing accounts

If unavailability extends past 30 days:
- Lawyer consultation on formal sprint suspensions
- Possible refunds of unworked upfront portions
- Possible engagement closures with documented terms

## Return to operations

When you return:

1. **Brief trusted contact** on what's continuing
2. **Reach out to every active client** personally within 48 hours
3. **Restart paused sprints** with updated timelines per Phase Zero principles
4. **Update succession documentation** with lessons learned from the incident
5. **Take a real break before diving in.** Don't immediately work 80-hour weeks to "catch up." That causes the next emergency.

## Post-incident review

After resolution:

- What was the trigger? Preventable?
- Was the trusted contact prepared enough?
- Were emergency procedures clear enough?
- What documentation was missing?
- What infrastructure (auto-billing, monitoring, etc.) helped vs hurt?

Update the protocol every time it's invoked.

---

# Cross-Protocol Principles

These principles apply across all five protocols:

## Communication discipline

For every failure mode, communication priorities are:

1. **Truth over comfort.** Be honest about what happened.
2. **Specificity over generality.** "QA failure on payment webhook handler" beats "technical issues."
3. **Options over apologies.** Lead with "here's what we can do" not "I'm so sorry."
4. **Speed over polish.** A rough message at hour 1 beats a polished one at hour 12.
5. **Consistency.** Use the templates. They work.

## Documentation discipline

Every failure produces:
- A timeline log
- A root cause analysis
- A knowledge bank contribution (anti-pattern, pattern, or ADR)
- A protocol update if the failure revealed a gap

Failures are expensive. Extracting maximum learning from them justifies the cost.

## Voice consistency

Avel's voice in failure communications:
- Short sentences
- No corporate hedging ("we are committed to," "moving forward," "best practices")
- No emotional softeners ("just," "hopefully," "perhaps")
- Direct and confident even when delivering bad news
- Outcomes-focused ("what's next" not "what went wrong")

A failure communicated well can actually strengthen the client relationship. Most vendors handle failures badly. Avel's discipline here is a competitive advantage.

## Insurance and legal

For protocols 3, 4, and 5, certain triggers may require:
- Errors & Omissions insurance claim
- General liability claim
- Lawyer consultation
- Compliance disclosure (GDPR, CCPA, state laws)

These are case-by-case. Maintain relationships with insurance broker and business lawyer so consultation is fast when needed.

---

# When These Protocols Don't Apply

Edge cases where these protocols are suspended or modified:

## Pro-bono or family-favor work

If you're doing free work for a friend's project, formal protocols are overkill. Stay professional but informal. Document what you're doing for your own learning, skip the formal sprint-abort process.

## Personal projects

Sprint Zero (building the command center) doesn't need full protocols — you can't ghost yourself. Use the framework but skip the formal client communications.

## Subcontracting

If you're working as a contractor for another agency (not Avel as primary), defer to their failure protocols. Don't impose Avel's protocols on someone else's client relationship.

---

# The Honest Read

These protocols are unsexy infrastructure. Nobody markets "we have great failure protocols." Clients don't pick vendors based on this.

But:
- Solo founders fail without them
- One bad failure communication can lose a client and damage reputation
- Documented protocols mean you act on system, not panic, when things go wrong

The cost: a few hours to read this document, identify your trusted contact, set up the emergency card. Maybe $500-1500 for legal review of templates.

The value: protection against the existential risks of solo founder + AI dev firm + productized service.

Worth it.

These protocols get refined the first time each one is invoked. Plan for revisions. The 5th time you handle a gate failure, the protocol will be better than what's written here. That's the point.

---

## Status

| Protocol | Status |
|---|---|
| Sprint abort | Documented, ready to use |
| Client ghost | Documented, ready to use |
| Gate failure recovery | Documented, ready to use |
| Production incident | Documented, ready to use — needs lawyer review for security incident specifics |
| Founder unavailable | Documented, needs trusted contact identified and emergency card produced |

All five protocols are operational. Refinements come from real-world use.
