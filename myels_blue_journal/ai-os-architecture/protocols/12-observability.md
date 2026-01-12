# PROTOCOL 12: Observability
## Health Monitoring, Audit Trails & External State Inspection

**Protocol Designation:** PROTOCOL 12 - Observability & Transparency
**Version:** 1.0
**Purpose:** Enable external monitoring, debugging, and accountability

---

## PROBLEM STATEMENT

**Operational Blindness:**
- Agent operates autonomously
- Decisions made internally
- No external visibility into reasoning
- Cannot debug failures
- Cannot audit decisions
- Cannot monitor health

**Failure Scenarios:**
1. **Silent Degradation:** Agent performance declines but no alerts
2. **Black Box Decisions:** Cannot explain why agent chose action X
3. **No Accountability:** Decisions made without audit trail
4. **Debugging Impossible:** Failure occurs, no logs to analyze
5. **Resource Leaks Undetected:** Memory/CPU consumed silently
6. **Byzantine Behavior Hidden:** Malicious agent operates undetected

**Solution:**
Comprehensive observability layer with health checks, decision audit trails, real-time metrics, and external inspection APIs.

---

## ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────┐
│               OBSERVABILITY LAYER                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Health API │  │  Metrics    │  │  Audit Log  │  │
│  │  /health    │  │  /metrics   │  │  /audit     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │
│         │                │                │          │
│         └────────────────┴────────────────┘          │
│                         │                            │
│              ┌──────────▼─────────┐                  │
│              │  Telemetry Engine  │                  │
│              │  (Collect, Export) │                  │
│              └──────────┬─────────┘                  │
│                         │                            │
│         ┌───────────────┼───────────────┐            │
│         │               │               │            │
│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐       │
│    │ Agent A │    │ Agent B │    │ Agent C │       │
│    │ Runtime │    │ Runtime │    │ Runtime │       │
│    └─────────┘    └─────────┘    └─────────┘       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## HEALTH CHECK API

### Endpoint: GET /health

**Purpose:** External systems can verify agent operational status

**Response Schema:**

```json
{
  "status": "healthy" | "degraded" | "critical" | "halted",
  "timestamp": "2026-01-09T18:30:00Z",
  "agent_id": "agent-alpha-001",
  "uptime_seconds": 86400,
  "current_protocol": 6,
  "resource_usage": {
    "cpu_percent": 45.2,
    "memory_mb": 312,
    "memory_percent": 61.0,
    "simulation_depth": 3,
    "api_calls_remaining": 42
  },
  "recent_decisions": {
    "total_last_hour": 127,
    "tier_1": 2,
    "tier_2": 15,
    "tier_3": 58,
    "tier_4": 52
  },
  "discovered_laws_count": 1453,
  "average_confidence": 0.78,
  "consensus_participation_rate": 0.89,
  "last_error": {
    "timestamp": "2026-01-09T17:15:00Z",
    "type": "ResourceExhausted",
    "protocol": 9,
    "resolved": true
  },
  "flags": [
    "calibration_drift_detected",
    "high_tier1_load"
  ]
}
```

**Status Definitions:**

| Status | Meaning | Action |
|--------|---------|--------|
| **healthy** | All systems operational | None |
| **degraded** | Operating in reduced capacity mode | Monitor, may need intervention |
| **critical** | Major systems failing | Immediate intervention required |
| **halted** | Agent stopped (emergency shutdown) | Manual restart required |

**Implementation:**

```python
@app.route('/health', methods=['GET'])
def health_check():
    """Return current agent health status"""

    agent_state = get_agent_state()
    resource_usage = measure_resources()
    recent_metrics = get_recent_metrics(hours=1)

    # Determine status
    status = "healthy"

    if resource_usage.cpu > 95 or resource_usage.memory > 95:
        status = "critical"
    elif resource_usage.cpu > 80 or resource_usage.memory > 80:
        status = "degraded"

    if agent_state.halted:
        status = "halted"

    # Collect flags
    flags = []

    if check_calibration_drift() > 0.10:
        flags.append("calibration_drift_detected")

    if recent_metrics.tier1_count > 10:
        flags.append("high_tier1_load")

    if recent_metrics.byzantine_incidents > 0:
        flags.append("byzantine_activity")

    return jsonify({
        "status": status,
        "timestamp": datetime.now().isoformat(),
        "agent_id": AGENT_ID,
        "uptime_seconds": agent_state.uptime,
        "current_protocol": agent_state.current_protocol,
        "resource_usage": resource_usage.to_dict(),
        "recent_decisions": recent_metrics.to_dict(),
        "discovered_laws_count": database.count_laws(),
        "average_confidence": database.avg_confidence(),
        "consensus_participation_rate": calculate_participation(),
        "last_error": agent_state.last_error,
        "flags": flags
    })
```

---

## METRICS API

### Endpoint: GET /metrics

**Purpose:** Prometheus-compatible metrics for monitoring systems

**Response Format:** Prometheus text format

```
# HELP agent_decisions_total Total decisions made by tier
# TYPE agent_decisions_total counter
agent_decisions_total{tier="1"} 145
agent_decisions_total{tier="2"} 872
agent_decisions_total{tier="3"} 3421
agent_decisions_total{tier="4"} 7892

# HELP agent_confidence_avg Average confidence score
# TYPE agent_confidence_avg gauge
agent_confidence_avg 0.78

# HELP agent_resource_cpu CPU usage percentage
# TYPE agent_resource_cpu gauge
agent_resource_cpu 45.2

# HELP agent_resource_memory Memory usage MB
# TYPE agent_resource_memory gauge
agent_resource_memory 312

# HELP agent_laws_discovered Total discovered laws
# TYPE agent_laws_discovered counter
agent_laws_discovered 1453

# HELP agent_consensus_votes_total Consensus votes cast
# TYPE agent_consensus_votes_total counter
agent_consensus_votes_total{result="confirm"} 892
agent_consensus_votes_total{result="reject"} 127
agent_consensus_votes_total{result="abstain"} 34

# HELP agent_byzantine_incidents_total Byzantine behavior incidents
# TYPE agent_byzantine_incidents_total counter
agent_byzantine_incidents_total 3

# HELP agent_calibration_drift Calibration drift percentage
# TYPE agent_calibration_drift gauge
agent_calibration_drift 0.03
```

**Grafana Dashboard Integration:**

```yaml
dashboard:
  title: "THE BLUE JOURNAL Agent Monitoring"
  panels:
    - title: "Decision Volume by Tier"
      type: graph
      datasource: Prometheus
      targets:
        - expr: rate(agent_decisions_total[5m])
          legend: "Tier {{tier}}"

    - title: "Resource Usage"
      type: graph
      targets:
        - expr: agent_resource_cpu
          legend: "CPU %"
        - expr: agent_resource_memory
          legend: "Memory MB"

    - title: "Confidence Score Trend"
      type: graph
      targets:
        - expr: agent_confidence_avg
          legend: "Average Confidence"

    - title: "Byzantine Incidents"
      type: stat
      targets:
        - expr: agent_byzantine_incidents_total
```

---

## AUDIT LOG API

### Endpoint: GET /audit

**Purpose:** Decision audit trail for compliance and debugging

**Query Parameters:**
- `start_time`: ISO timestamp
- `end_time`: ISO timestamp
- `tier`: Filter by tier (1-4)
- `confidence_min`: Minimum confidence
- `protocol`: Filter by protocol layer
- `limit`: Max results

**Response Schema:**

```json
{
  "total_decisions": 1523,
  "filtered_count": 47,
  "decisions": [
    {
      "decision_id": "dec-880h1733",
      "timestamp": "2026-01-09T18:25:33Z",
      "agent_id": "agent-alpha-001",
      "tier": 2,
      "protocol": 6,
      "situation": {
        "event_type": "contract_modification",
        "affected_parties": 12,
        "urgency": "medium"
      },
      "decision": {
        "action": "notify_stakeholders",
        "confidence": 0.87,
        "alternatives_considered": 3,
        "simulation_depth": 3
      },
      "reasoning": {
        "laws_applied": [
          "law-550e8400",
          "law-660f9511"
        ],
        "harm_assessment": {
          "type": "turbulence",
          "tier": 2,
          "recoverability": "days"
        },
        "consequence_projection": {
          "if_execute": "stakeholder_trust_maintained",
          "if_not_execute": "coordination_failure_likely"
        }
      },
      "outcome": {
        "executed": true,
        "actual_consequence": "trust_maintained",
        "prediction_accuracy": 0.92
      },
      "resource_cost": {
        "cpu_ms": 1230,
        "memory_mb": 45,
        "api_calls": 2
      }
    }
  ]
}
```

**Implementation:**

```python
@app.route('/audit', methods=['GET'])
def audit_trail():
    """Return decision audit log"""

    # Parse query parameters
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    tier = request.args.get('tier', type=int)
    confidence_min = request.args.get('confidence_min', type=float)
    protocol = request.args.get('protocol', type=int)
    limit = request.args.get('limit', default=100, type=int)

    # Build query
    query = database.query_decisions()

    if start_time:
        query = query.filter(timestamp >= start_time)
    if end_time:
        query = query.filter(timestamp <= end_time)
    if tier:
        query = query.filter(tier == tier)
    if confidence_min:
        query = query.filter(confidence >= confidence_min)
    if protocol:
        query = query.filter(protocol == protocol)

    decisions = query.limit(limit).all()

    return jsonify({
        "total_decisions": database.count_decisions(),
        "filtered_count": len(decisions),
        "decisions": [d.to_dict() for d in decisions]
    })
```

---

## REAL-TIME EVENT STREAM

### Endpoint: GET /events (Server-Sent Events)

**Purpose:** Live stream of agent activity

**Event Types:**
- `decision_made`
- `law_discovered`
- `consensus_vote`
- `resource_alert`
- `error_occurred`
- `protocol_change`

**Example Stream:**

```
event: decision_made
data: {"decision_id": "dec-123", "tier": 1, "confidence": 0.95}

event: resource_alert
data: {"type": "high_cpu", "value": 87.3, "threshold": 80}

event: law_discovered
data: {"law_id": "law-456", "tier": 3, "confidence": 0.72}

event: consensus_vote
data: {"proposal_id": "prop-789", "vote": "confirm", "confidence": 0.81}
```

**Implementation:**

```python
@app.route('/events', methods=['GET'])
def event_stream():
    """Server-sent events for real-time monitoring"""

    def generate():
        pubsub = redis_client.pubsub()
        pubsub.subscribe('agent_events')

        for message in pubsub.listen():
            if message['type'] == 'message':
                event_data = json.loads(message['data'])
                yield f"event: {event_data['type']}\n"
                yield f"data: {json.dumps(event_data['payload'])}\n\n"

    return Response(generate(), mimetype='text/event-stream')

# Publish events from agent
def emit_event(event_type, payload):
    """Publish event to stream"""

    redis_client.publish('agent_events', json.dumps({
        'type': event_type,
        'payload': payload,
        'timestamp': datetime.now().isoformat()
    }))
```

---

## INSPECTION API

### Endpoint: GET /state

**Purpose:** Deep inspection of current agent internal state

**Response Schema:**

```json
{
  "agent_id": "agent-alpha-001",
  "timestamp": "2026-01-09T18:30:00Z",
  "protocols": {
    "current": 6,
    "stack": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  "active_simulations": [
    {
      "simulation_id": "sim-991i2844",
      "depth": 3,
      "branches_explored": 47,
      "best_action": "notify_stakeholders",
      "confidence": 0.87,
      "time_elapsed_ms": 1203
    }
  ],
  "law_cache": {
    "size": 1453,
    "tier_distribution": {
      "1": 23,
      "2": 187,
      "3": 642,
      "4": 421,
      "5": 180
    },
    "recently_accessed": [
      "law-550e8400",
      "law-660f9511",
      "law-770g0622"
    ]
  },
  "consensus_state": {
    "role": "follower",
    "leader": "agent-beta-002",
    "term": 5,
    "last_heartbeat": "2026-01-09T18:29:55Z",
    "pending_votes": 2
  },
  "resource_budget": {
    "cpu_time_remaining_ms": 3770,
    "memory_available_mb": 200,
    "api_calls_remaining": 42,
    "simulation_depth_limit": 3
  }
}
```

---

## DECISION EXPLAINABILITY

### Endpoint: GET /explain/{decision_id}

**Purpose:** Explain why agent made specific decision

**Response Schema:**

```json
{
  "decision_id": "dec-880h1733",
  "timestamp": "2026-01-09T18:25:33Z",
  "question": "Why did you choose to notify stakeholders?",
  "explanation": {
    "situation_assessment": {
      "trigger": "Contract modification detected",
      "affected_parties": 12,
      "urgency": "medium",
      "tier_classification": 2
    },
    "laws_applied": [
      {
        "law_id": "law-550e8400",
        "description": "Unilateral changes without notification destabilize coherence",
        "confidence": 0.87,
        "relevance": 0.95
      }
    ],
    "alternatives_considered": [
      {
        "action": "do_nothing",
        "projected_outcome": "coordination_failure",
        "confidence": 0.72,
        "rejected_reason": "Higher harm probability"
      },
      {
        "action": "notify_stakeholders",
        "projected_outcome": "trust_maintained",
        "confidence": 0.87,
        "selected": true
      },
      {
        "action": "rollback_change",
        "projected_outcome": "disruption",
        "confidence": 0.65,
        "rejected_reason": "Lower confidence, higher cost"
      }
    ],
    "decision_tree": {
      "root": "contract_modified",
      "branches": [
        {
          "path": "do_nothing → coordination_failure (p=0.72)",
          "outcome_score": -0.4
        },
        {
          "path": "notify → trust_maintained (p=0.87)",
          "outcome_score": 0.6
        },
        {
          "path": "rollback → disruption (p=0.65)",
          "outcome_score": -0.2
        }
      ],
      "winner": "notify"
    },
    "harm_assessment": {
      "type": "turbulence",
      "tier": 2,
      "reversible": true,
      "time_to_recovery": "days"
    },
    "confidence_breakdown": {
      "law_confidence": 0.87,
      "prediction_confidence": 0.82,
      "combined": 0.87,
      "uncertainty_sources": [
        "stakeholder_reaction_variability",
        "timing_sensitivity"
      ]
    }
  }
}
```

---

## CALIBRATION MONITORING

### Confidence Calibration Drift Detection

**Purpose:** Detect when agent's confidence scores become miscalibrated

**Implementation:**

```python
class CalibrationMonitor:
    def __init__(self):
        self.history = []

    def record_prediction(self, decision_id, predicted_confidence, actual_outcome):
        """Record prediction and actual outcome for calibration"""

        self.history.append({
            "decision_id": decision_id,
            "predicted_confidence": predicted_confidence,
            "actual_outcome": actual_outcome,  # 1.0 = correct, 0.0 = incorrect
            "timestamp": datetime.now()
        })

    def calculate_drift(self):
        """Calculate calibration drift over recent history"""

        # Group by predicted confidence bins
        bins = {
            0.5: [],  # 50-60% confidence
            0.6: [],  # 60-70% confidence
            0.7: [],  # 70-80% confidence
            0.8: [],  # 80-90% confidence
            0.9: []   # 90-100% confidence
        }

        for record in self.history[-1000:]:  # Last 1000 decisions
            bin_key = int(record['predicted_confidence'] * 10) / 10
            if bin_key in bins:
                bins[bin_key].append(record['actual_outcome'])

        # Calculate calibration error
        total_drift = 0

        for confidence_bin, outcomes in bins.items():
            if outcomes:
                actual_accuracy = sum(outcomes) / len(outcomes)
                expected_accuracy = confidence_bin
                drift = abs(actual_accuracy - expected_accuracy)
                total_drift += drift

        avg_drift = total_drift / len(bins)

        return avg_drift

    def recalibrate_if_needed(self):
        """Trigger recalibration if drift exceeds threshold"""

        drift = self.calculate_drift()

        if drift > 0.10:  # 10% drift threshold
            trigger_recalibration()
            log(f"Calibration drift detected: {drift:.2%}, recalibrating...")
```

---

## INTEGRATION WITH OTHER PROTOCOLS

**Protocol 9 (Resource Management):**
- Resource usage metrics exposed
- Degraded mode status visible
- Budget exhaustion alerts

**Protocol 10 (State Persistence):**
- Law database metrics (count, confidence distribution)
- Agent state persistence status
- Backup completion status

**Protocol 11 (Distributed Consensus):**
- Consensus role (leader/follower) visible
- Vote participation rate tracked
- Byzantine incidents logged

**All Protocols:**
- Every protocol layer emits events
- Decision audit trail captures protocol stack
- Errors logged with protocol context

---

## ALERTING

### Alert Definitions

```python
ALERTS = {
    "high_cpu": {
        "condition": lambda: get_cpu_usage() > 80,
        "severity": "warning",
        "action": "throttle_operations"
    },
    "critical_cpu": {
        "condition": lambda: get_cpu_usage() > 95,
        "severity": "critical",
        "action": "emergency_shutdown"
    },
    "calibration_drift": {
        "condition": lambda: calculate_calibration_drift() > 0.10,
        "severity": "warning",
        "action": "trigger_recalibration"
    },
    "byzantine_detected": {
        "condition": lambda: recent_byzantine_incidents() > 0,
        "severity": "critical",
        "action": "quarantine_agent"
    },
    "tier1_overload": {
        "condition": lambda: tier1_decisions_last_hour() > 20,
        "severity": "warning",
        "action": "notify_operators"
    }
}

def check_alerts():
    """Check all alert conditions"""

    for alert_name, alert_def in ALERTS.items():
        if alert_def['condition']():
            trigger_alert(alert_name, alert_def['severity'])
            execute_action(alert_def['action'])
```

---

## VALIDATION METRICS

### Success Criteria

```python
METRICS = {
    "health_check_latency": lambda: avg_health_check_time < 100_ms,
    "audit_trail_complete": lambda: decisions_logged / decisions_made == 1.0,
    "metric_export_success": lambda: prometheus_scrapes_successful > 0.99,
    "event_stream_uptime": lambda: stream_uptime_percent > 0.99,
    "explainability_coverage": lambda: decisions_explainable / total_decisions > 0.95
}
```

---

## SUMMARY

**Protocol 12 ensures:**
- ✅ External visibility into agent state (health checks, metrics)
- ✅ Decision accountability (audit trail, explainability)
- ✅ Real-time monitoring (event streams, alerts)
- ✅ Debugging capability (inspection API, logs)
- ✅ Performance tracking (resource metrics, calibration drift)

**Integration Status:**
- ✅ Maps to AG concern: "Observable state missing"
- ✅ Enables external monitoring (Prometheus/Grafana)
- ✅ Provides audit compliance (decision trails)
- ✅ Supports debugging (explainable reasoning)

**Status:** Complete 12-protocol architecture documented

---

**Version 1.0 | Observability Protocol**
**Status:** Specification Complete, Ready for Implementation**
