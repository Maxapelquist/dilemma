-- Skapa en ny kategori för sex
INSERT INTO public.categories (name, description, icon) 
VALUES ('Sex & Intimitet', 'Utforska er sexualitet och intimitet tillsammans', '🔥');

-- Hämta category_id för den nya kategorin
DO $$ 
DECLARE 
    sex_category_id uuid;
BEGIN
    SELECT id INTO sex_category_id FROM public.categories WHERE name = 'Sex & Intimitet';
    
    -- Lägg till preference_options för BDSM underkategorin
    INSERT INTO public.preference_options (title, description, category_id, subcategory) VALUES
    ('Bondage & Ropes', 'Utforska bondage och rep-teknik tillsammans', sex_category_id, 'BDSM'),
    ('Dominance & Submission', 'Rollspel med dominans och undergivenhet', sex_category_id, 'BDSM'),
    ('Spanking & Impact Play', 'Olika former av impact play och spanking', sex_category_id, 'BDSM'),
    ('Sensory Play', 'Stimulera sinnena med temperatur, texturer och känsel', sex_category_id, 'BDSM'),
    
    -- Rollspel underkategorin
    ('Cosplay & Kostym', 'Klä ut er och leva ut fantasier med kostymer', sex_category_id, 'Rollspel'),
    ('Professionella Roller', 'Läkare/patient, lärare/elev och andra scenarion', sex_category_id, 'Rollspel'),
    ('Historiska Karaktärer', 'Medeltida, viktorianska eller andra tidsperioder', sex_category_id, 'Rollspel'),
    ('Fantasy & Sci-Fi', 'Utomjordingar, vampyrer, och andra fantasyvarelser', sex_category_id, 'Rollspel'),
    
    -- Föremål & Leksaker underkategorin
    ('Vibratorer & Stimulatorer', 'Olika typer av vibrerande leksaker', sex_category_id, 'Föremål & Leksaker'),
    ('Anal Leksaker', 'Analplugg, pärlor och andra analleksaker', sex_category_id, 'Föremål & Leksaker'),
    ('Kopplings Leksaker', 'Leksaker för par att använda tillsammans', sex_category_id, 'Föremål & Leksaker'),
    ('Remote Control', 'Fjärrstyrda leksaker för spännande upplevelser', sex_category_id, 'Föremål & Leksaker'),
    
    -- Platser & Äventyr underkategorin
    ('Utomhus Sex', 'Naturens egen sovkammare - strand, skog, bergstopp', sex_category_id, 'Platser & Äventyr'),
    ('Bil & Transport', 'Sexiga äventyr i bil, tåg eller andra fordon', sex_category_id, 'Platser & Äventyr'),
    ('Hotell & Resande', 'Spännande hotellkväller på olika destinationer', sex_category_id, 'Platser & Äventyr'),
    ('Hemma Äventyr', 'Olika rum i hemmet för nya upplevelser', sex_category_id, 'Platser & Äventyr'),
    
    -- Fetischer underkategorin
    ('Fot Fetisch', 'Fokus på fötter och skor i ert sexliv', sex_category_id, 'Fetischer'),
    ('Latex & Läder', 'Material som latex, läder och vinyl', sex_category_id, 'Fetischer'),
    ('Crossdressing', 'Utforska kläder och uttryck från motsatt kön', sex_category_id, 'Fetischer'),
    ('Voyeurism & Exhibition', 'Titta och bli sedda på säkra och lagliga sätt', sex_category_id, 'Fetischer'),
    
    -- Kommunikation & Intimitet underkategorin
    ('Dirty Talk', 'Konsten att prata smutsigt och upphetsande', sex_category_id, 'Kommunikation & Intimitet'),
    ('Sexting & Meddelanden', 'Heta meddelanden och bilder mellan er', sex_category_id, 'Kommunikation & Intimitet'),
    ('Känslomässig Intimitet', 'Djup känslomässig koppling under sex', sex_category_id, 'Kommunikation & Intimitet'),
    ('Tantrasex', 'Långsam, meditativ och andlig sexuell upplevelse', sex_category_id, 'Kommunikation & Intimitet');
END $$;