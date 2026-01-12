# PROTOCOL 10: State Persistence
## Knowledge Base Architecture for Discovered Laws

**Protocol Designation:** PROTOCOL 10 - State Persistence & Synchronization
**Version:** 1.0
**Purpose:** Maintain discovered laws across restarts and enable multi-agent knowledge sharing

---

## PROBLEM STATEMENT

**Current Gap:**
- Agent discovers laws through interaction (Protocol 2)
- Laws exist only in runtime memory
- System restart = all learned knowledge lost
- Multi-agent deployments cannot share discoveries

**Failure Scenarios:**
1. **Restart Amnesia:** Agent crashes → restarts → relearns same laws (inefficient)
2. **Knowledge Isolation:** Agent A discovers law → Agent B unaware → duplicated work
3. **Conflict Undetected:** Agent A: "Law X is true" | Agent B: "Law ~X is true" → no resolution
4. **Version Drift:** Law updated → old agents using stale version → inconsistent behavior

**Solution:**
Persistent knowledge base with versioning, conflict detection, and multi-agent synchronization.

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Law DB     │  │  Vector DB   │  │  Event Log   │  │
│  │  (Relational)│  │  (Embeddings)│  │  (Append)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                          │                              │
│                ┌─────────▼────────┐                     │
│                │  Sync Manager    │                     │
│                │  (Versioning,    │                     │
│                │   Conflict Res)  │                     │
│                └─────────┬────────┘                     │
│                          │                              │
│         ┌────────────────┼────────────────┐             │
│         │                │                │             │
│    ┌────▼────┐      ┌───▼────┐      ┌───▼────┐        │
│    │ Agent A │      │Agent B │      │Agent C │        │
│    │ Runtime │      │Runtime │      │Runtime │        │
│    └─────────┘      └────────┘      └────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## DATABASE SCHEMA

### 1. Discovered Laws Table

```sql
CREATE TABLE discovered_laws (
    law_id UUID PRIMARY KEY,
    tier INTEGER NOT NULL,  -- 1=Physical, 2=Logical, 3=Systems, 4=Social, 5=Pattern
    description TEXT NOT NULL,
    consequence_pattern JSON NOT NULL,  -- Input → Output mapping
    confidence FLOAT NOT NULL,  -- 0.0 to 1.0
    evidence_count INTEGER DEFAULT 1,
    falsifications INTEGER DEFAULT 0,
    discovered_by UUID,  -- Agent ID
    discovered_at TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',  -- active, contested, deprecated
    embedding VECTOR(1536),  -- For similarity search
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT valid_tier CHECK (tier >= 1 AND tier <= 5)
);

CREATE INDEX idx_law_tier ON discovered_laws(tier);
CREATE INDEX idx_law_confidence ON discovered_laws(confidence);
CREATE INDEX idx_law_status ON discovered_laws(status);
CREATE INDEX idx_law_embedding ON discovered_laws USING ivfflat (embedding vector_cosine_ops);
```

**Example Entry:**

```json
{
    "law_id": "550e8400-e29b-41d4-a716-446655440000",
    "tier": 3,
    "description": "Unilateral contract changes without notification destabilize system coherence",
    "consequence_pattern": {
        "trigger": "contract_modified AND notification_sent == false",
        "consequence": "trust_erosion + coordination_failure",
        "severity": "medium",
        "recoverability": "weeks"
    },
    "confidence": 0.87,
    "evidence_count": 23,
    "falsifications": 1,
    "discovered_by": "agent-alpha-001",
    "discovered_at": "2026-01-09T14:23:00Z",
    "last_updated": "2026-01-09T16:45:00Z",
    "version": 2,
    "status": "active"
}
```

---

### 2. Evidence Table

```sql
CREATE TABLE law_evidence (
    evidence_id UUID PRIMARY KEY,
    law_id UUID REFERENCES discovered_laws(law_id),
    observation JSON NOT NULL,  -- What was observed
    outcome JSON NOT NULL,  -- What happened
    timestamp TIMESTAMP NOT NULL,
    agent_id UUID NOT NULL,
    supports_law BOOLEAN NOT NULL,  -- true = confirms, false = falsifies
    CONSTRAINT fk_law FOREIGN KEY (law_id) REFERENCES discovered_laws(law_id)
);

CREATE INDEX idx_evidence_law ON law_evidence(law_id);
CREATE INDEX idx_evidence_support ON law_evidence(supports_law);
```

**Example Entry:**

```json
{
    "evidence_id": "660f9511-f39c-52e5-b827-557766551111",
    "law_id": "550e8400-e29b-41d4-a716-446655440000",
    "observation": {
        "action": "modified_contract",
        "notification_sent": false,
        "affected_parties": 15
    },
    "outcome": {
        "trust_score_before": 0.82,
        "trust_score_after": 0.61,
        "coordination_failures": 3,
        "time_to_resolution": "14 days"
    },
    "timestamp": "2026-01-09T14:23:00Z",
    "agent_id": "agent-alpha-001",
    "supports_law": true
}
```

---

### 3. Law Conflicts Table

```sql
CREATE TABLE law_conflicts (
    conflict_id UUID PRIMARY KEY,
    law_a_id UUID REFERENCES discovered_laws(law_id),
    law_b_id UUID REFERENCES discovered_laws(law_id),
    conflict_type VARCHAR(50),  -- contradiction, overlap, context_dependent
    detected_at TIMESTAMP NOT NULL,
    resolved BOOLEAN DEFAULT false,
    resolution JSON,
    CONSTRAINT different_laws CHECK (law_a_id != law_b_id)
);

CREATE INDEX idx_conflicts_unresolved ON law_conflicts(resolved) WHERE resolved = false;
```

**Example Entry:**

```json
{
    "conflict_id": "770g0622-g40d-63f6-c938-668877662222",
    "law_a_id": "550e8400-e29b-41d4-a716-446655440000",
    "law_b_id": "881h1733-h51e-74g7-d049-779988773333",
    "conflict_type": "context_dependent",
    "detected_at": "2026-01-09T17:00:00Z",
    "resolved": true,
    "resolution": {
        "method": "context_split",
        "outcome": "Law A applies in public API context, Law B applies in internal service context",
        "confidence": 0.91
    }
}
```

---

### 4. Agent State Table

```sql
CREATE TABLE agent_state (
    agent_id UUID PRIMARY KEY,
    current_protocol INTEGER,  -- Which protocol stack is active
    resource_profile VARCHAR(50),
    last_heartbeat TIMESTAMP NOT NULL,
    discovered_laws_count INTEGER DEFAULT 0,
    decisions_made_count INTEGER DEFAULT 0,
    average_confidence FLOAT,
    status VARCHAR(20) DEFAULT 'active',  -- active, degraded, halted
    metadata JSON
);

CREATE INDEX idx_agent_status ON agent_state(status);
CREATE INDEX idx_agent_heartbeat ON agent_state(last_heartbeat);
```

---

## VECTOR EMBEDDINGS

### Purpose: Semantic Similarity Search

**Problem:** How to find related laws when consequence patterns are complex?

**Solution:** Embed law descriptions as vectors, use cosine similarity

**Implementation:**

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_law(law):
    """Convert law description to 384-dim vector"""
    text = f"{law['description']} {json.dumps(law['consequence_pattern'])}"
    return model.encode(text)

def find_similar_laws(query_law, threshold=0.85):
    """Find laws semantically similar to query"""
    query_embedding = embed_law(query_law)

    similar = database.execute("""
        SELECT law_id, description, confidence,
               1 - (embedding <=> %s) AS similarity
        FROM discovered_laws
        WHERE 1 - (embedding <=> %s) > %s
        ORDER BY similarity DESC
        LIMIT 10
    """, (query_embedding, query_embedding, threshold))

    return similar
```

**Use Cases:**
- **Duplicate Detection:** Before adding new law, check if similar law exists
- **Conflict Detection:** Find laws that might contradict each other
- **Pattern Matching:** "What laws apply to this situation?"

---

## SYNCHRONIZATION PROTOCOLS

### Protocol S1: Agent Startup

```python
def agent_startup():
    """Load persistent state on agent initialization"""

    # 1. Load own historical state
    agent_state = database.fetch_agent_state(AGENT_ID)

    if agent_state.exists():
        restore_from_checkpoint(agent_state)
    else:
        initialize_new_agent()

    # 2. Load active laws from shared database
    active_laws = database.fetch_laws(status='active', tier__lte=current_tier)

    for law in active_laws:
        load_into_runtime(law)

    # 3. Subscribe to law update stream
    subscribe_to_law_updates()

    # 4. Announce presence to other agents
    broadcast_presence(AGENT_ID)
```

---

### Protocol S2: Law Discovery

```python
def discover_new_law(observation, consequence):
    """Agent discovers a new law through interaction"""

    # 1. Generate law from pattern
    candidate_law = {
        "description": describe_pattern(observation, consequence),
        "consequence_pattern": extract_pattern(observation, consequence),
        "confidence": calculate_initial_confidence(),
        "tier": classify_tier(consequence),
        "discovered_by": AGENT_ID,
        "discovered_at": datetime.now()
    }

    # 2. Check for similar existing laws
    similar_laws = find_similar_laws(candidate_law, threshold=0.90)

    if similar_laws:
        # Update existing law instead of creating duplicate
        existing_law = similar_laws[0]
        update_law_evidence(existing_law['law_id'], observation, consequence)
        return existing_law

    # 3. No similar law → create new
    law_id = database.insert_law(candidate_law)

    # 4. Add supporting evidence
    database.insert_evidence(law_id, observation, consequence, supports=True)

    # 5. Broadcast to other agents
    broadcast_new_law(law_id)

    return law_id
```

---

### Protocol S3: Law Update

```python
def update_law(law_id, new_evidence):
    """Update law confidence based on new evidence"""

    law = database.fetch_law(law_id)

    # 1. Add evidence to database
    database.insert_evidence(
        law_id=law_id,
        observation=new_evidence['observation'],
        outcome=new_evidence['outcome'],
        supports_law=new_evidence['supports']
    )

    # 2. Recalculate confidence using Bayesian update
    prior_confidence = law['confidence']
    evidence_weight = calculate_evidence_weight(new_evidence)

    if new_evidence['supports']:
        # Evidence supports → increase confidence
        posterior_confidence = bayesian_update_positive(
            prior_confidence, evidence_weight
        )
    else:
        # Evidence falsifies → decrease confidence
        posterior_confidence = bayesian_update_negative(
            prior_confidence, evidence_weight
        )

    # 3. Update database
    database.update("""
        UPDATE discovered_laws
        SET confidence = %s,
            evidence_count = evidence_count + 1,
            falsifications = falsifications + %s,
            last_updated = NOW(),
            version = version + 1
        WHERE law_id = %s
    """, (posterior_confidence, 1 if not new_evidence['supports'] else 0, law_id))

    # 4. Broadcast update to other agents
    broadcast_law_update(law_id, posterior_confidence)

    # 5. Check if law should be deprecated
    if posterior_confidence < 0.30:
        deprecate_law(law_id, reason="confidence_too_low")
```

---

### Protocol S4: Conflict Detection

```python
def detect_conflicts(new_law):
    """Detect if new law contradicts existing laws"""

    # 1. Find semantically similar laws
    similar_laws = find_similar_laws(new_law, threshold=0.75)

    conflicts = []

    for existing_law in similar_laws:
        # 2. Check for logical contradiction
        if contradicts(new_law, existing_law):
            conflict = {
                "law_a_id": new_law['law_id'],
                "law_b_id": existing_law['law_id'],
                "conflict_type": classify_conflict(new_law, existing_law),
                "detected_at": datetime.now()
            }

            # 3. Record conflict
            conflict_id = database.insert_conflict(conflict)
            conflicts.append(conflict_id)

            # 4. Mark both laws as contested
            database.update_law_status(new_law['law_id'], 'contested')
            database.update_law_status(existing_law['law_id'], 'contested')

    # 5. Trigger conflict resolution (Protocol 11)
    if conflicts:
        initiate_consensus_protocol(conflicts)

    return conflicts
```

---

## VERSIONING SYSTEM

### Semantic Versioning for Laws

```python
class LawVersion:
    def __init__(self, major, minor, patch):
        self.major = major  # Breaking change (consequence pattern changed)
        self.minor = minor  # New evidence (confidence updated)
        self.patch = patch  # Metadata update (description clarified)

    def __str__(self):
        return f"{self.major}.{self.minor}.{self.patch}"

def increment_version(law, change_type):
    """Update version based on change type"""

    current = parse_version(law['version'])

    if change_type == "BREAKING":
        # Consequence pattern changed significantly
        new_version = LawVersion(current.major + 1, 0, 0)

    elif change_type == "MINOR":
        # Evidence added, confidence updated
        new_version = LawVersion(current.major, current.minor + 1, 0)

    elif change_type == "PATCH":
        # Metadata update only
        new_version = LawVersion(current.major, current.minor, current.patch + 1)

    database.update_law_version(law['law_id'], str(new_version))
    return new_version
```

---

### Migration Protocol

```python
def migrate_agents_to_new_version(law_id, new_version):
    """Notify all agents of breaking change in law"""

    # 1. Fetch all active agents
    active_agents = database.fetch_agents(status='active')

    # 2. Broadcast migration notice
    for agent in active_agents:
        send_message(agent['agent_id'], {
            "type": "LAW_BREAKING_CHANGE",
            "law_id": law_id,
            "old_version": get_law_version(law_id) - 1,
            "new_version": new_version,
            "action_required": "reload_law_into_runtime"
        })

    # 3. Monitor migration progress
    while not all_agents_migrated(law_id, new_version):
        check_migration_status()
        time.sleep(5)

    # 4. Deprecate old version
    deprecate_law_version(law_id, new_version - 1)
```

---

## GARBAGE COLLECTION

### Deprecated Law Cleanup

```python
def garbage_collect_laws():
    """Remove low-value laws to prevent database bloat"""

    # 1. Find candidates for removal
    deprecated_laws = database.fetch_laws("""
        SELECT * FROM discovered_laws
        WHERE (
            (confidence < 0.20 AND evidence_count > 10) OR
            (status = 'deprecated' AND last_updated < NOW() - INTERVAL '90 days') OR
            (evidence_count < 3 AND discovered_at < NOW() - INTERVAL '180 days')
        )
    """)

    # 2. Archive before deletion
    for law in deprecated_laws:
        archive_law(law)  # Move to cold storage

    # 3. Delete from active database
    database.execute("""
        DELETE FROM discovered_laws
        WHERE law_id IN (%s)
    """, [law['law_id'] for law in deprecated_laws])

    log(f"Garbage collected {len(deprecated_laws)} laws")
```

---

## BACKUP & RECOVERY

### Continuous Backup

```python
def continuous_backup():
    """Backup critical state every N minutes"""

    while True:
        # 1. Export discovered laws
        laws_snapshot = database.export_laws()
        save_to_blob_storage(f"laws_backup_{timestamp()}.json", laws_snapshot)

        # 2. Export agent states
        agents_snapshot = database.export_agent_states()
        save_to_blob_storage(f"agents_backup_{timestamp()}.json", agents_snapshot)

        # 3. Retention: Keep last 30 days of backups
        delete_old_backups(retention_days=30)

        time.sleep(600)  # Every 10 minutes
```

### Disaster Recovery

```python
def restore_from_backup(backup_timestamp):
    """Restore system state from backup"""

    # 1. Halt all agents
    broadcast_halt_signal()

    # 2. Load backup data
    laws_backup = load_from_blob_storage(f"laws_backup_{backup_timestamp}.json")
    agents_backup = load_from_blob_storage(f"agents_backup_{backup_timestamp}.json")

    # 3. Clear current database
    database.truncate_all_tables()

    # 4. Restore from backup
    database.import_laws(laws_backup)
    database.import_agent_states(agents_backup)

    # 5. Restart agents
    broadcast_restart_signal()

    log(f"System restored from backup: {backup_timestamp}")
```

---

## INTEGRATION WITH OTHER PROTOCOLS

**Protocol 2 (Constraint Discovery):**
- Discovered laws stored persistently
- Evidence accumulates over time
- Confidence updates via Bayesian inference

**Protocol 9 (Resource Management):**
- Law database size monitored
- Garbage collection when storage exceeds threshold
- LRU cache for frequently accessed laws

**Protocol 11 (Distributed Consensus):**
- Multi-agent law verification requires shared database
- Conflict detection uses persistent conflict table
- Voting results stored for audit trail

**Protocol 12 (Observability):**
- Database metrics exposed (law count, avg confidence, conflicts)
- Agent state visible to external monitors
- Backup status reported via health API

---

## VALIDATION METRICS

### Success Criteria

```python
METRICS = {
    "zero_data_loss": lambda: backups_successful_last_30_days == 30,
    "fast_startup": lambda: agent_startup_time < 5_seconds,
    "conflict_detection": lambda: contradictory_laws_detected > 0,
    "knowledge_sharing": lambda: multi_agent_law_reuse > 0.70,
    "version_consistency": lambda: agents_on_latest_version > 0.95
}
```

### Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| **Law retrieval latency** | <50ms | TBD |
| **Startup time (1000 laws)** | <5s | TBD |
| **Database size (10k laws)** | <500MB | TBD |
| **Backup frequency** | Every 10min | TBD |
| **Agent sync latency** | <100ms | TBD |

---

## SUMMARY

**Protocol 10 ensures:**
- ✅ Discovered laws persist across restarts (no amnesia)
- ✅ Multi-agent knowledge sharing (distributed intelligence)
- ✅ Conflict detection (contradictory laws identified)
- ✅ Versioning system (breaking changes managed)
- ✅ Backup & recovery (disaster resilience)

**Integration Status:**
- ✅ Maps to AG concern: "State persistence undefined"
- ✅ Enables multi-agent coordination (Protocol 11)
- ✅ Provides audit trail (Protocol 12)
- ✅ Manages storage resources (Protocol 9)

**Next:** [Protocol 11: Distributed Consensus](./11-distributed-consensus.md)

---

**Version 1.0 | State Persistence Protocol**
**Status:** Specification Complete, Ready for Implementation**
