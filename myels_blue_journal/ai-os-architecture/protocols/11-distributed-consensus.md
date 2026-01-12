# PROTOCOL 11: Distributed Consensus
## Multi-Agent Law Verification & Byzantine Fault Tolerance

**Protocol Designation:** PROTOCOL 11 - Distributed Consensus & Conflict Resolution
**Version:** 1.0
**Purpose:** Enable multi-agent coordination with Byzantine fault tolerance

---

## PROBLEM STATEMENT

**Multi-Agent Challenges:**

1. **Contradictory Discoveries:**
   - Agent A: "Law X discovered with 90% confidence"
   - Agent B: "Law ~X discovered with 85% confidence"
   - Question: Who is right?

2. **Byzantine Agents:**
   - Malicious agent broadcasts false laws to corrupt shared knowledge base
   - Faulty agent has miscalibrated sensors → reports incorrect patterns
   - Compromised agent under attacker control

3. **Deadlock Risk:**
   - Agent A waits for Agent B's verification
   - Agent B waits for Agent C's verification
   - Agent C waits for Agent A's verification
   - Result: All agents frozen

4. **Network Partitions:**
   - Agent cluster splits into two groups
   - Each group operates independently
   - When network heals → conflicting states must reconcile

**Solution:**
Hybrid consensus protocol combining Raft (leader election, log replication) with PBFT-style Byzantine fault tolerance and independent verification requirements.

---

## CONSENSUS ALGORITHM

### Core Principle: Independent Verification

```
Law is accepted if and only if:
1. N >= 60% of agents independently verify it
2. No Byzantine behavior detected in verifiers
3. Evidence quality meets threshold
4. No higher-confidence contradictory law exists
```

**Why 60%?**
- **Byzantine Fault Tolerance:** Can tolerate up to 40% Byzantine agents
- **Availability:** System remains operational even if 40% of agents are offline/faulty
- **Balance:** Not too strict (paralysis) or too lenient (corruption risk)

---

## PROTOCOL ARCHITECTURE

```
┌──────────────────────────────────────────────────────────┐
│                   CONSENSUS LAYER                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐                                         │
│  │   LEADER    │  Elected via Raft                       │
│  │  (Agent 1)  │  Coordinates verification rounds        │
│  └──────┬──────┘                                         │
│         │                                                 │
│         │ Broadcast: "Please verify Law X"               │
│         │                                                 │
│    ┌────┴─────────────────────────┐                      │
│    │                               │                      │
│ ┌──▼────┐  ┌──────┐  ┌──────┐  ┌──▼────┐               │
│ │Agent 2│  │Agent3│  │Agent4│  │Agent 5│               │
│ │VERIFY │  │VERIFY│  │VERIFY│  │VERIFY │               │
│ └──┬────┘  └──┬───┘  └──┬───┘  └──┬────┘               │
│    │          │         │          │                      │
│    └──────────┴─────────┴──────────┘                      │
│               │                                            │
│         Votes: 3/4 confirm                                │
│         Result: 75% consensus → ACCEPT                    │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## VERIFICATION PROTOCOL

### Step 1: Law Proposal

```python
def propose_law(law):
    """Agent proposes newly discovered law to cluster"""

    # 1. Check if agent is leader (only leader can propose)
    if not is_leader():
        forward_to_leader(law)
        return

    # 2. Assign proposal ID
    proposal_id = generate_proposal_id()

    # 3. Broadcast to all agents
    proposal = {
        "proposal_id": proposal_id,
        "law": law,
        "proposed_by": AGENT_ID,
        "proposed_at": datetime.now(),
        "verification_deadline": datetime.now() + timedelta(seconds=30)
    }

    broadcast_to_cluster(proposal)

    # 4. Collect votes
    votes = collect_votes(proposal_id, timeout=30)

    # 5. Decide based on votes
    if votes['confirm'] >= 0.60 * cluster_size():
        accept_law(law)
    else:
        reject_law(law, reason=f"Insufficient consensus: {votes['confirm']}/{cluster_size()}")
```

---

### Step 2: Independent Verification

```python
def verify_law_proposal(proposal):
    """Agent independently verifies proposed law"""

    law = proposal['law']

    # 1. Attempt to reproduce discovery
    try:
        observations = gather_relevant_observations(law)
        reproduced = test_law_against_observations(law, observations)

        if reproduced:
            confidence = calculate_confidence(law, observations)
            vote = "CONFIRM" if confidence > 0.70 else "REJECT"
        else:
            vote = "REJECT"
            confidence = 0.0

    except Exception as e:
        # Verification failed → abstain
        vote = "ABSTAIN"
        confidence = None

    # 2. Check for conflicts with existing laws
    conflicts = detect_conflicts(law)

    if conflicts:
        # Law contradicts existing high-confidence law
        existing_confidence = max([c['confidence'] for c in conflicts])

        if law['confidence'] < existing_confidence:
            vote = "REJECT"

    # 3. Byzantine detection: Is proposer known malicious?
    if is_byzantine_agent(proposal['proposed_by']):
        vote = "REJECT"
        flag_suspicious_proposal(proposal)

    # 4. Cast vote
    cast_vote(proposal['proposal_id'], vote, confidence)

    return vote
```

---

### Step 3: Vote Aggregation

```python
def aggregate_votes(proposal_id):
    """Tally votes and determine consensus"""

    votes = database.fetch_votes(proposal_id)

    confirm = sum(1 for v in votes if v['vote'] == 'CONFIRM')
    reject = sum(1 for v in votes if v['vote'] == 'REJECT')
    abstain = sum(1 for v in votes if v['vote'] == 'ABSTAIN')

    total_voters = len(votes)
    cluster_size = get_cluster_size()

    # Byzantine detection: Check for vote manipulation
    if total_voters > cluster_size:
        # More votes than agents → attack detected
        trigger_byzantine_alert("vote_stuffing", proposal_id)
        return "REJECTED_ATTACK"

    # Quorum check: Did enough agents participate?
    quorum = 0.50 * cluster_size  # Minimum 50% participation

    if total_voters < quorum:
        return "INSUFFICIENT_PARTICIPATION"

    # Consensus check: Did 60%+ of participants confirm?
    if confirm >= 0.60 * total_voters:
        return "ACCEPTED"
    elif reject >= 0.60 * total_voters:
        return "REJECTED"
    else:
        return "NO_CONSENSUS"  # Contested
```

---

## BYZANTINE FAULT TOLERANCE

### Detection Mechanisms

#### 1. Verification Fraud Detection

```python
def detect_verification_fraud(agent_id, law_id):
    """Detect if agent is claiming to verify impossible law"""

    # Agent claims: "I verified Law X independently"
    # Check: Does agent have necessary sensors/data to verify?

    law = database.fetch_law(law_id)
    agent_capabilities = database.fetch_agent_capabilities(agent_id)

    required_sensors = law['verification_requirements']['sensors']
    required_data = law['verification_requirements']['historical_data']

    if not agent_capabilities.has_sensors(required_sensors):
        flag_suspicious_vote(agent_id, law_id, "missing_sensors")
        return True

    if not agent_capabilities.has_data(required_data):
        flag_suspicious_vote(agent_id, law_id, "missing_data")
        return True

    return False
```

#### 2. Pattern Anomaly Detection

```python
def detect_anomalous_voting_pattern(agent_id):
    """Detect if agent votes suspiciously"""

    voting_history = database.fetch_agent_votes(agent_id, last_n=100)

    # Red flag 1: Always confirms, never rejects
    if voting_history['reject_rate'] < 0.05:
        flag_agent(agent_id, "suspiciously_agreeable")

    # Red flag 2: Confirms low-quality proposals
    low_quality_confirms = [
        v for v in voting_history
        if v['vote'] == 'CONFIRM' and v['proposal_confidence'] < 0.40
    ]

    if len(low_quality_confirms) > 10:
        flag_agent(agent_id, "confirms_low_quality")

    # Red flag 3: Voting pattern correlates with known Byzantine agent
    for other_agent in get_flagged_agents():
        correlation = calculate_vote_correlation(agent_id, other_agent)

        if correlation > 0.95:
            flag_agent(agent_id, f"correlated_with_{other_agent}")
```

#### 3. Signature Verification

```python
def verify_vote_signature(vote):
    """Ensure vote hasn't been tampered with"""

    # Each vote is cryptographically signed by agent
    agent_public_key = get_agent_public_key(vote['agent_id'])

    signature_valid = verify_signature(
        message=vote['content'],
        signature=vote['signature'],
        public_key=agent_public_key
    )

    if not signature_valid:
        flag_suspicious_vote(vote['agent_id'], vote['proposal_id'], "invalid_signature")
        return False

    return True
```

---

### Quarantine Protocol

```python
def quarantine_byzantine_agent(agent_id, reason):
    """Remove Byzantine agent from consensus participation"""

    # 1. Record incident
    database.insert_incident({
        "agent_id": agent_id,
        "incident_type": "byzantine_behavior",
        "reason": reason,
        "detected_at": datetime.now()
    })

    # 2. Update agent status
    database.update_agent_status(agent_id, "quarantined")

    # 3. Notify cluster
    broadcast_to_cluster({
        "type": "AGENT_QUARANTINED",
        "agent_id": agent_id,
        "reason": reason
    })

    # 4. Exclude from future votes
    remove_from_voter_pool(agent_id)

    # 5. Audit past votes
    audit_past_votes(agent_id)

    log(f"Agent {agent_id} quarantined for {reason}")
```

---

## LEADER ELECTION (Raft-Based)

### Purpose: Prevent Chaos in Proposal Coordination

**Problem:** If all agents can propose simultaneously → vote overload

**Solution:** Elect leader who coordinates proposals

```python
class RaftConsensus:
    def __init__(self):
        self.state = "FOLLOWER"  # FOLLOWER, CANDIDATE, LEADER
        self.current_term = 0
        self.voted_for = None
        self.election_timeout = random.randint(150, 300)  # ms

    def start_election(self):
        """Become candidate and request votes"""

        self.state = "CANDIDATE"
        self.current_term += 1
        self.voted_for = AGENT_ID

        # Request votes from other agents
        votes_received = 1  # Vote for self

        for agent in get_cluster_agents():
            response = request_vote(agent, self.current_term)

            if response['vote_granted']:
                votes_received += 1

        # Become leader if majority
        if votes_received > len(get_cluster_agents()) / 2:
            self.become_leader()

    def become_leader(self):
        """Transition to leader state"""

        self.state = "LEADER"

        # Send heartbeats to maintain leadership
        while self.state == "LEADER":
            send_heartbeats()
            time.sleep(0.1)  # 100ms heartbeat interval

    def receive_heartbeat(self, leader_id, term):
        """Receive heartbeat from leader"""

        if term >= self.current_term:
            self.current_term = term
            self.state = "FOLLOWER"
            reset_election_timeout()
```

---

## CONFLICT RESOLUTION

### Scenario: Contradictory Laws Proposed

```python
def resolve_contradiction(law_a, law_b):
    """Two laws contradict each other—resolve"""

    # Strategy 1: Higher confidence wins
    if law_a['confidence'] > law_b['confidence'] + 0.15:
        return law_a, "higher_confidence"

    if law_b['confidence'] > law_a['confidence'] + 0.15:
        return law_b, "higher_confidence"

    # Strategy 2: More evidence wins
    if law_a['evidence_count'] > law_b['evidence_count'] * 2:
        return law_a, "more_evidence"

    if law_b['evidence_count'] > law_a['evidence_count'] * 2:
        return law_b, "more_evidence"

    # Strategy 3: Context-dependent (both valid in different contexts)
    contexts = identify_differing_contexts(law_a, law_b)

    if contexts:
        return split_by_context(law_a, law_b, contexts), "context_split"

    # Strategy 4: Run live A/B test
    winner = run_ab_test(law_a, law_b, duration_hours=24)
    return winner, "empirical_test"
```

---

### A/B Testing for Contested Laws

```python
def run_ab_test(law_a, law_b, duration_hours=24):
    """Deploy both laws in parallel, measure which performs better"""

    # 1. Split cluster into two groups
    group_a_agents = random.sample(get_cluster_agents(), k=cluster_size() // 2)
    group_b_agents = [a for a in get_cluster_agents() if a not in group_a_agents]

    # 2. Assign laws
    for agent in group_a_agents:
        agent.use_law(law_a)

    for agent in group_b_agents:
        agent.use_law(law_b)

    # 3. Monitor performance
    time.sleep(duration_hours * 3600)

    # 4. Compare outcomes
    outcomes_a = collect_outcomes(group_a_agents)
    outcomes_b = collect_outcomes(group_b_agents)

    # 5. Statistical test
    p_value = t_test(outcomes_a, outcomes_b)

    if p_value < 0.05:
        # Statistically significant difference
        if mean(outcomes_a) > mean(outcomes_b):
            winner = law_a
        else:
            winner = law_b
    else:
        # No significant difference → keep both as context-dependent
        winner = None

    return winner
```

---

## DEADLOCK PREVENTION

### Timeout Protocol

```python
def verify_with_timeout(proposal_id, timeout=30):
    """Prevent indefinite waiting for votes"""

    start = time.now()
    votes = []

    while time.now() - start < timeout:
        new_votes = check_for_new_votes(proposal_id)
        votes.extend(new_votes)

        # Early exit if consensus reached
        if consensus_achieved(votes):
            return aggregate_votes(proposal_id)

        time.sleep(0.5)  # Poll every 500ms

    # Timeout reached → decide with available votes
    return aggregate_votes(proposal_id)
```

---

### Asynchronous Messaging

```python
# WRONG: Synchronous blocking
def synchronous_verify(law):
    for agent in agents:
        vote = agent.verify(law)  # Blocks until agent responds
        votes.append(vote)

# RIGHT: Asynchronous non-blocking
async def asynchronous_verify(law):
    tasks = [agent.verify(law) for agent in agents]
    votes = await asyncio.gather(*tasks, return_exceptions=True)

    # Handle failures gracefully
    valid_votes = [v for v in votes if not isinstance(v, Exception)]
    return valid_votes
```

---

### Leader Timeout

```python
def follower_election_timeout():
    """If no heartbeat from leader → start new election"""

    while True:
        wait_for_heartbeat(timeout=election_timeout)

        if not heartbeat_received():
            # Leader died or network partition
            start_election()

        time.sleep(0.1)
```

---

## NETWORK PARTITION HANDLING

### Split-Brain Prevention

```python
def handle_network_partition():
    """Cluster splits into two groups—prevent inconsistency"""

    # Partition detected: Agent A can't reach Agent B

    # 1. Determine partition size
    reachable_agents = discover_reachable_agents()

    if len(reachable_agents) < cluster_size() / 2:
        # Minority partition → cannot achieve quorum
        enter_read_only_mode()
        return

    # Majority partition → continue operating

    # 2. When partition heals, reconcile state
    def on_partition_heal():
        other_partition_state = fetch_state_from_other_partition()
        reconcile_states(local_state, other_partition_state)
```

---

### State Reconciliation

```python
def reconcile_states(state_a, state_b):
    """Merge two diverged states after partition heals"""

    # 1. Identify conflicts
    conflicts = []

    for law_id in set(state_a.laws.keys()) & set(state_b.laws.keys()):
        law_a = state_a.laws[law_id]
        law_b = state_b.laws[law_id]

        if law_a != law_b:
            conflicts.append((law_id, law_a, law_b))

    # 2. Resolve conflicts
    for law_id, law_a, law_b in conflicts:
        resolved = resolve_contradiction(law_a, law_b)
        merged_state.laws[law_id] = resolved

    # 3. Merge unique laws (in A but not B, or vice versa)
    for law_id in set(state_a.laws.keys()) - set(state_b.laws.keys()):
        merged_state.laws[law_id] = state_a.laws[law_id]

    for law_id in set(state_b.laws.keys()) - set(state_a.laws.keys()):
        merged_state.laws[law_id] = state_b.laws[law_id]

    return merged_state
```

---

## INTEGRATION WITH OTHER PROTOCOLS

**Protocol 2 (Constraint Discovery):**
- Laws discovered individually → verified collectively
- Confidence updated based on multi-agent consensus

**Protocol 7 (Security):**
- Byzantine agent detection prevents malicious law injection
- Signature verification ensures vote integrity

**Protocol 10 (State Persistence):**
- Consensus decisions stored in shared database
- Voting history persisted for audit trail

**Protocol 12 (Observability):**
- Leader election events logged
- Byzantine incidents visible to external monitors
- Consensus metrics exposed (vote participation rate, conflicts)

---

## VALIDATION METRICS

### Success Criteria

```python
METRICS = {
    "byzantine_tolerance": lambda: system_operational_with_40percent_faulty == True,
    "no_deadlocks": lambda: deadlock_incidents == 0,
    "fast_consensus": lambda: avg_consensus_time < 5_seconds,
    "partition_resilience": lambda: recovers_from_partition == True,
    "false_accept_rate": lambda: false_law_acceptances / total_proposals < 0.01
}
```

### Performance Benchmarks

| Metric | Target | Notes |
|--------|--------|-------|
| **Consensus latency** | <5s | Time from proposal to decision |
| **Byzantine agent detection** | <30s | Time to detect and quarantine |
| **Vote participation rate** | >80% | Percentage of agents voting |
| **Partition recovery time** | <60s | Time to reconcile after heal |
| **Leader election time** | <1s | Time to elect new leader if current fails |

---

## SUMMARY

**Protocol 11 ensures:**
- Multi-agent law verification (no single point of failure)
- Byzantine fault tolerance (40% malicious agents tolerated)
- Deadlock prevention (timeouts, async messaging)
- Network partition handling (split-brain prevention, reconciliation)
- Conflict resolution (A/B testing, context splitting)

**Integration Status:**
- Maps to AG concern: "Distributed consensus missing"
- Enables multi-agent coordination at scale
- Prevents knowledge corruption (Byzantine defense)
- Requires Protocol 10 (shared database for voting)

**Next:** [Protocol 12: Observability](./12-observability.md)

---

**Version 1.0 | Distributed Consensus Protocol**
**Status:** Specification Complete, Ready for Implementation**
