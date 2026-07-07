name: banking-qa-knowledge
description: Apply banking QA knowledge - risk categories, boundary values,
and test case format for ParaBank features

## Risk Categories - Always Evaluate All of These

### Financial Risks
- Transfer amount exceeds available balance
- DecimalTprecision issues (e.g. 0.001 rounding behaviour)
- Amount exceeds configured daily/transaction limit

### Fraud Risks
- Double submission: user clicks Submit twice rapidly
- Session replay: reusing an expired authenticated session
- Cross-account access: transferring from account user does not own

### Boundary Values - Always Test for Amount Fields
| Type

| Zero boundary
| Negative
| Minimum valid
Exact balance
Over balance
Max integer
| Precision test

### Validation Risks
- SQL injection in any input field
- Non-numeric characters in amount field
- Empty form submission
- Invalid account number format

### Business Rule Risks
- Self-transfer: same source and destination account
- Transfer to closed or suspended account

### Concurrency Risks
- Simultaneous transfers draining the same source account

Value

-1
0.01
[balance]
[balance+0.01] |
999999999
0.001

| Expected Behaviour

Reject - invalid
| Reject - invalid
| Accept
Accept - edge case
| Reject - insufficient
| Reject or cap
Validate rounding