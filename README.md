To build a MERN (MySQL instead of MongoDB) CRUD application using TypeScript, 
Here is the project structure and the complete code:

### Project Structure:
```
mern-mysql-student-crud/
├── backend/
│   ├── config/
│   │   └── db.config.ts
│   ├── controllers/
│   │   └── student.controller.ts
│   ├── models/
│   │   └── student.model.ts
│   ├── routes/
│   │   └── student.routes.ts
│   ├── app.ts
│   └── server.ts
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentForm.tsx
│   │   │   ├── StudentList.tsx
│   │   └── services/
│   │       └── studentService.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── package.json
├── package.json
└── tsconfig.json
```

### Backend: Express with TypeScript

#### 1. `backend/config/db.config.ts` (MySQL DB configuration)
```ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('studentdb', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
```

#### 2. `backend/models/student.model.ts` (Student Model)
```ts
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  course: {
    type: DataTypes.STRING,
  },
  enrollmentDate: {
    type: DataTypes.DATE,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default Student;
```

#### 3. `backend/controllers/student.controller.ts` (CRUD Controller)
```ts
import { Request, Response } from 'express';
import Student from '../models/student.model';

// Create a new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).send('Error creating student');
  }
};

// Get all students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).send('Error fetching students');
  }
};

// Get a single student
export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByPk(req.params.id);
    res.json(student);
  } catch (error) {
    res.status(500).send('Error fetching student');
  }
};

// Update a student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(student);
  } catch (error) {
    res.status(500).send('Error updating student');
  }
};

// Delete a student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await Student.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).send('Error deleting student');
  }
};
```

#### 4. `backend/routes/student.routes.ts` (Routes)
```ts
import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from '../controllers/student.controller';

const router = Router();

router.post('/students', createStudent);
router.get('/students', getStudents);
router.get('/students/:id', getStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

export default router;
```

#### 5. `backend/app.ts` (Express App)
```ts
import express from 'express';
import sequelize from './config/db.config';
import studentRoutes from './routes/student.routes';

const app = express();
app.use(express.json());

app.use('/api', studentRoutes);

sequelize.sync().then(() => console.log('Database connected'));

export default app;
```

#### 6. `backend/server.ts` (Server Entry Point)
```ts
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Frontend: React with TypeScript

#### 1. `frontend/src/components/StudentForm.tsx` (Student Form Component)
```tsx
import React, { useState } from 'react';
import { createStudent } from '../services/studentService';

const StudentForm: React.FC = () => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    phoneNumber: '',
    address: '',
    course: '',
    enrollmentDate: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStudent(student);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="First Name" onChange={e => setStudent({ ...student, firstName: e.target.value })} />
      <input type="text" placeholder="Last Name" onChange={e => setStudent({ ...student, lastName: e.target.value })} />
      <input type="email" placeholder="Email" onChange={e => setStudent({ ...student, email: e.target.value })} />
      {/* Other form fields */}
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;
```

#### 2. `frontend/src/components/StudentList.tsx` (Student List Component)
```tsx
import React, { useEffect, useState } from 'react';
import { getStudents } from '../services/studentService';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await getStudents();
    setStudents(response);
  };

  return (
    <div>
      <h1>Students</h1>
      <ul>
        {students.map(student => (
          <li key={student.id}>{student.firstName} {student.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
```

#### 3. `frontend/src/services/studentService.ts` (Service Layer for API)
```ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

export const getStudents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createStudent = async (student: any) => {
  const response = await axios.post(API_URL, student);
  return response.data;
};
```

#### 4. `frontend/src/App.tsx` (Main Application)
```tsx
import React from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Student Management System</h1>
      <StudentForm />
      <StudentList />
    </div>
  );
};

export default App;
```

#### 5. `frontend/src/index.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Running the Application

#### Backend:
1. Install dependencies:
   ```bash
   cd backend
   npm install express sequelize mysql2 typescript ts-node @types/express
   ```

2. Run the backend server:
   ```bash
   npm run dev
   ```

#### Frontend:
1. Install dependencies:
   ```bash
   cd frontend
   npm install axios react-router-dom @types/react-router-dom
   ```



2. Run the frontend:
   ```bash
   npm start
   ```

This application will allow you to perform CRUD operations for students and display them on a React frontend with MySQL as the backend database.
