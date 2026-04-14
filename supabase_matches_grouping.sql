-- إضافة أعمدة إضافية لترتيب المباريات حسب الدوري
ALTER TABLE matches ADD COLUMN IF NOT EXISTS league_logo TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS league_code TEXT;
