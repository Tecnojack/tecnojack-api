-- Create dynamic business code generator PL/pgSQL function in PostgreSQL
CREATE OR REPLACE FUNCTION get_next_business_code(
  p_prefix TEXT,
  p_pad_length INT DEFAULT 6
)
RETURNS TEXT AS $$
DECLARE
  v_seq_name TEXT;
  v_next_val BIGINT;
BEGIN
  v_seq_name := 'seq_code_' || LOWER(TRIM(p_prefix));

  -- Create sequence dynamically if it does not exist yet
  EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I START WITH 1 INCREMENT BY 1', v_seq_name);

  -- Retrieve nextval atomically from PostgreSQL sequence
  EXECUTE format('SELECT nextval(%L)', v_seq_name) INTO v_next_val;

  -- Return formatted business code (e.g., PER-000001, ORG-000001, EVT-000001)
  RETURN UPPER(TRIM(p_prefix)) || '-' || LPAD(v_next_val::TEXT, p_pad_length, '0');
END;
$$ LANGUAGE plpgsql;
