# ETHGlobal Bangkok Thailand
## API Prisma

**วันที่:** 07/11/2024
---

### **รายละเอียด**  
API สำหรับ Lighthouse:  
- **GET** `/api/light-house/api-key`  
- **POST** `/api/light-house/upload`

---

**วันที่:** 12/11/2024
---
1. **`missions`**: Stores the details of the available missions.
2. **`missions_log`**: Records user activities and their status for each mission.

## Database Schema

### Table: `missions`
Stores the metadata of each mission.

| Column       | Type       | Description                              |
|--------------|------------|------------------------------------------|
| `id`         | `SERIAL`   | Primary Key                             |
| `name`       | `VARCHAR`  | Name of the mission                     |
| `type`       | `VARCHAR`  | Type of the mission (e.g., filecoin, transaction, uniswap) |

#### Sample Data
| id  | name                   | type        | 
|-----|------------------------|-------------|
| 1   | Filecoin Storage Quest | filecoin    | 
| 2   | Sign Transaction Quest | transaction | 
| 3   | Uniswap Trade Quest    | uniswap     | 

---

### Table: `missions_log`
Logs user activities for each mission.

| Column       | Type       | Description                              |
|--------------|------------|------------------------------------------|
| `id`         | `SERIAL`   | Primary Key                             |
| `mission_id` | `INT`      | Foreign Key linking to `missions.id`    |
| `user_id`    | `VARCHAR`  | ID of the user who performed the mission|
| `status`     | `VARCHAR`  | Status of the mission (e.g., success, failed, pending) |
| `details`    | `TEXT`     | Additional information or error details |
| `timestamp`  | `TIMESTAMP`| Time when the log was created           |

#### Sample Data
| id  | mission_id | user_id | status   | details                        | timestamp           |
|-----|------------|---------|----------|-------------------------------|---------------------|
| 1   | 1          | 12345   | success  | File stored successfully      | 2024-11-05 12:00:00 |
| 2   | 2          | 67890   | failed   | Signature verification failed | 2024-11-05 12:30:00 |
| 3   | 3          | 34567   | pending  | Waiting for transaction       | 2024-11-05 13:00:00 |

---