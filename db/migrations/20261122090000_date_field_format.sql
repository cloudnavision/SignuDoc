-- What a date field stamps when the signer signs: the day (the default, as
-- before), the day and the time, or only the time. Null means the day.

alter table public.fields
  add column if not exists date_format text;

alter table public.fields
  drop constraint if exists fields_date_format_only_on_dates;

alter table public.fields
  add constraint fields_date_format_only_on_dates check (
    date_format is null
    or (type = 'date' and date_format in ('date', 'date_time', 'time'))
  );
