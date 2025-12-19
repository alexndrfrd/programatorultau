# Monitoring & Logging

## 📊 Swagger UI

Documentația API interactivă este disponibilă la:
```
http://localhost:3000/api-docs
```

Poți testa toate endpoint-urile direct din browser!

## 📝 Logs API

### Endpoint pentru Logs

```
GET /api/logs
```

**Query Parameters:**
- `file` - `combined` (default) sau `error`
- `level` - `error`, `warn`, `info`, `debug`
- `lines` - Număr de linii (default: 100)

**Exemple:**
```bash
# Ultimele 100 de loguri
curl http://localhost:3000/api/logs

# Doar erorile
curl "http://localhost:3000/api/logs?level=error&file=error"

# Ultimele 50 de loguri
curl "http://localhost:3000/api/logs?lines=50"
```

## 📂 Log Files

Logurile sunt salvate în `backend/logs/`:
- `combined.log` - Toate logurile
- `error.log` - Doar erorile
- `exceptions.log` - Excepții neprinse
- `rejections.log` - Promise rejections

**Vezi logurile:**
```bash
# Toate logurile
tail -f backend/logs/combined.log

# Doar erorile
tail -f backend/logs/error.log
```

## 🔍 Grafana + Loki (Opțional - pentru aplicații mari)

### Setup Grafana + Loki

#### 1. Docker Compose

Creează `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - loki-data:/loki

  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./logs:/var/log/app:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning

volumes:
  loki-data:
  grafana-data:
```

#### 2. Promtail Configuration

Creează `promtail-config.yml`:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: app-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: programatorultau
          __path__: /var/log/app/*.log
```

#### 3. Grafana Data Source

Creează `grafana/provisioning/datasources/loki.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: true
    jsonData:
      maxLines: 1000
```

#### 4. Start Monitoring Stack

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Accesează Grafana: http://localhost:3001
- User: `admin`
- Password: `admin`

### Grafana Queries

**Toate logurile:**
```logql
{job="programatorultau"}
```

**Doar erorile:**
```logql
{job="programatorultau"} |= "error"
```

**Loguri de la ultimele 5 minute:**
```logql
{job="programatorultau"} [5m]
```

**Căutare după text:**
```logql
{job="programatorultau"} |~ "Booking created"
```

## 📈 Dashboard Grafana

### Import Dashboard

1. Mergi în Grafana → Dashboards → Import
2. Importă JSON-ul de mai jos sau creează propriul dashboard

### Dashboard JSON

```json
{
  "dashboard": {
    "title": "Programatorul Tău - Logs",
    "panels": [
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate({job=\"programatorultau\"} |= \"error\" [5m])"
          }
        ]
      },
      {
        "title": "Recent Logs",
        "targets": [
          {
            "expr": "{job=\"programatorultau\"}"
          }
        ]
      }
    ]
  }
}
```

## 🔔 Alerting

### Grafana Alerts

Creează alert-uri în Grafana pentru:
- **High Error Rate**: Mai mult de 10 erori/minut
- **No Logs**: Nu sunt loguri în ultimele 5 minute
- **Database Errors**: Erori de conexiune la database

### Alert Configuration

```yaml
# grafana/provisioning/alerting/rules.yml
groups:
  - name: app_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate({job="programatorultau"} |= "error" [5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## 🚀 Alternativă Simplă: Log Viewer Web

### Endpoint Simplu pentru Logs

Endpoint-ul `/api/logs` deja există și poate fi folosit cu un frontend simplu.

### Frontend Simplu (opțional)

Poți crea o pagină HTML simplă pentru a vizualiza logurile:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Log Viewer</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        .log-entry { margin: 5px 0; padding: 10px; border-left: 3px solid #ccc; }
        .error { border-color: red; background: #ffe6e6; }
        .warn { border-color: orange; background: #fff4e6; }
        .info { border-color: blue; background: #e6f3ff; }
    </style>
</head>
<body>
    <h1>Log Viewer</h1>
    <div id="logs"></div>
    <script>
        async function loadLogs() {
            const response = await fetch('/api/logs?lines=100');
            const data = await response.json();
            const container = document.getElementById('logs');
            data.logs.forEach(log => {
                const div = document.createElement('div');
                div.className = `log-entry ${log.level}`;
                div.textContent = `${log.timestamp} [${log.level}]: ${log.message}`;
                container.appendChild(div);
            });
        }
        loadLogs();
        setInterval(loadLogs, 5000); // Refresh every 5 seconds
    </script>
</body>
</html>
```

## 📊 Metrics (Opțional)

Pentru metrics avansate, consideră:
- **Prometheus** - pentru metrics
- **Grafana** - pentru vizualizare
- **Node Exporter** - pentru system metrics

## ✅ Checklist Producție

- [ ] Swagger UI accesibil la `/api-docs`
- [ ] Logs API funcționează la `/api/logs`
- [ ] Grafana + Loki configurat (opțional)
- [ ] Alert-uri configurate
- [ ] Dashboard-uri create
- [ ] Log rotation configurat
- [ ] Backup pentru loguri importante

## 🔒 Securitate

**IMPORTANT**: În producție:
- Protejează endpoint-ul `/api/logs` cu autentificare
- Nu expune loguri sensibile (passwords, tokens)
- Limitează accesul la Grafana
- Folosește HTTPS pentru toate conexiunile

