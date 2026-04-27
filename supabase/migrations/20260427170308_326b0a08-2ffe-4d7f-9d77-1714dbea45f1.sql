-- Shifts table
CREATE TABLE public.shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  role TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage shifts"
  ON public.shifts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees view own shifts"
  ON public.shifts FOR SELECT
  USING (auth.uid() = employee_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_shifts_employee_date ON public.shifts(employee_id, shift_date);
CREATE INDEX idx_shifts_date ON public.shifts(shift_date);

-- Payroll entries
CREATE TABLE public.payroll_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  hours_worked NUMERIC(6,2) NOT NULL DEFAULT 0,
  hourly_rate NUMERIC(8,2) NOT NULL DEFAULT 0,
  gross_pay NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payroll_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payroll"
  ON public.payroll_entries FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees view own payroll"
  ON public.payroll_entries FOR SELECT
  USING (auth.uid() = employee_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_payroll_updated_at
  BEFORE UPDATE ON public.payroll_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_payroll_employee ON public.payroll_entries(employee_id);
CREATE INDEX idx_payroll_period ON public.payroll_entries(period_start, period_end);