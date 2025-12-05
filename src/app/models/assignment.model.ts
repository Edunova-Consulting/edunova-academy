export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date?: string;
  max_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudentAssignment {
  id: string;
  assignment_id: string;
  student_id: string;
  score?: number;
  submitted_at?: string;
  status?: 'pending' | 'submitted' | 'graded';
  created_at?: string;
  updated_at?: string;
}

