/*
  # Create Applicants Table with GIP Fields

  ## Overview
  Creates the applicants table to store information for both GIP (Government Internship Program)
  and TUPAD (Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers) programs.
  Includes all fields required for the DOLE-GIP Application Form A.

  ## Tables Created
  
  ### `applicants`
  Main table for storing applicant information:
  - `id` (uuid, primary key) - Unique identifier
  - `code` (text) - Program-specific code (GIP-XXXXXX or TPD-XXXXXX)
  - `first_name` (text) - First name
  - `middle_name` (text, optional) - Middle name
  - `last_name` (text) - Last name
  - `extension_name` (text, optional) - Suffix (JR, SR, III, etc.)
  - `birth_date` (date) - Date of birth
  - `age` (integer) - Age
  - `barangay` (text) - Barangay/district
  - `contact_number` (text) - Contact number
  - `telephone_number` (text) - Landline telephone number
  - `email` (text, optional) - Email address
  - `place_of_birth` (text) - City/province of birth
  - `school` (text, optional) - School name
  - `gender` (text) - Gender (MALE/FEMALE)
  - `civil_status` (text) - Civil status (both GIP and TUPAD)
  - `educational_attainment` (text) - Education level
  - `course` (text) - Course taken (for college/vocational graduates)
  - `beneficiary_name` (text, optional) - Beneficiary name (GIP)
  - `photo_file_name` (text) - 2x2 photo file name
  - `photo_file_data` (text) - 2x2 photo file data (base64)
  - `id_type` (text, optional) - Type of ID submitted (TUPAD)
  - `id_number` (text, optional) - ID number (TUPAD)
  - `occupation` (text, optional) - Occupation (TUPAD)
  - `average_monthly_income` (text, optional) - Monthly income (TUPAD)
  - `dependent_name` (text, optional) - Dependent name (TUPAD)
  - `relationship_to_dependent` (text, optional) - Relationship to dependent (TUPAD)
  - `resume_file_name` (text, optional) - Resume file name
  - `resume_file_data` (text, optional) - Resume file data (base64)
  - `encoder` (text) - Who encoded the record
  - `status` (text) - Application status
  - `program` (text) - Program type (GIP/TUPAD)
  - `archived` (boolean) - Whether record is archived
  - `archived_date` (date, optional) - When record was archived
  - `date_submitted` (date) - Submission date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enables Row Level Security (RLS) on applicants table
  - Adds policy for authenticated users to read all applicants
  - Adds policy for authenticated users to insert new applicants
  - Adds policy for authenticated users to update applicants
  - Adds policy for authenticated users to delete applicants

  ## Important Notes
  1. New GIP-specific fields added:
     - place_of_birth: City/province where applicant was born
     - telephone_number: Landline phone for residential address
     - civil_status: Now used for both GIP and TUPAD
     - photo_file_name & photo_file_data: For 2x2 ID photo
     - course: Course taken (conditional on educational attainment)
  
  2. Course field is conditional - only filled when educational attainment is:
     - "COLLEGE GRADUATE"
     - "TECHNICAL/VOCATIONAL COURSE GRADUATE"
  
  3. All text fields use DEFAULT '' to avoid null issues
  4. Timestamps are automatically managed
  5. Includes proper indexing for performance
*/

CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL DEFAULT '',
  first_name text NOT NULL DEFAULT '',
  middle_name text DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  extension_name text DEFAULT '',
  birth_date date NOT NULL,
  age integer NOT NULL DEFAULT 0,
  barangay text NOT NULL DEFAULT '',
  contact_number text NOT NULL DEFAULT '',
  telephone_number text DEFAULT '',
  email text DEFAULT '',
  place_of_birth text DEFAULT '',
  school text DEFAULT '',
  gender text NOT NULL DEFAULT 'MALE',
  civil_status text DEFAULT '',
  educational_attainment text DEFAULT '',
  course text DEFAULT '',
  beneficiary_name text DEFAULT '',
  photo_file_name text DEFAULT '',
  photo_file_data text DEFAULT '',
  id_type text DEFAULT '',
  id_number text DEFAULT '',
  occupation text DEFAULT '',
  average_monthly_income text DEFAULT '',
  dependent_name text DEFAULT '',
  relationship_to_dependent text DEFAULT '',
  resume_file_name text DEFAULT '',
  resume_file_data text DEFAULT '',
  encoder text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PENDING',
  program text NOT NULL DEFAULT 'GIP',
  archived boolean DEFAULT false,
  archived_date date,
  date_submitted date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all applicants"
  ON applicants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert applicants"
  ON applicants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update applicants"
  ON applicants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete applicants"
  ON applicants
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_applicants_program ON applicants(program);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_archived ON applicants(archived);
CREATE INDEX IF NOT EXISTS idx_applicants_code ON applicants(code);