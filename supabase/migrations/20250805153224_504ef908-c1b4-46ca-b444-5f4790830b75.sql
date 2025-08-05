-- Utöka Aktiviteter-kategorin med massor av underkategorier och preferenser
DO $$ 
DECLARE 
    aktiviteter_category_id uuid;
    sex_category_id uuid;
BEGIN
    -- Hämta category_id för Aktiviteter
    SELECT id INTO aktiviteter_category_id FROM public.categories WHERE name = 'Aktiviteter';
    SELECT id INTO sex_category_id FROM public.categories WHERE name = 'Sex & Intimitet';
    
    -- Lägg till created_at kolumn för att kunna sortera kategorierna
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order integer;
    
    -- Uppdatera sorteringsordning för kategorierna
    UPDATE public.categories SET sort_order = 1 WHERE name = 'Aktiviteter';
    UPDATE public.categories SET sort_order = 2 WHERE name = 'Sex & Intimitet';
    UPDATE public.categories SET sort_order = 3 WHERE name = 'Mat & Dryck';
    UPDATE public.categories SET sort_order = 4 WHERE name = 'Resor';
    UPDATE public.categories SET sort_order = 99 WHERE sort_order IS NULL;
    
    -- Lägg till massor av aktiviteter grupperade efter underkategorier
    
    -- SPORT & FITNESS
    INSERT INTO public.preference_options (title, description, category_id, subcategory) VALUES
    ('Gym & Styrketräning', 'Träna tillsammans på gym eller hemma med vikter', aktiviteter_category_id, 'Sport & Fitness'),
    ('Löpning & Jogging', 'Morgonjogg eller längre löprundor tillsammans', aktiviteter_category_id, 'Sport & Fitness'),
    ('Simning', 'Poolträning, öppet vatten eller bara mysig simning', aktiviteter_category_id, 'Sport & Fitness'),
    ('Tennis & Racketsport', 'Tennis, padel, badminton eller squash', aktiviteter_category_id, 'Sport & Fitness'),
    ('Klättring & Bouldering', 'Inomhus eller utomhusklättring, via ferrata', aktiviteter_category_id, 'Sport & Fitness'),
    ('Cykling', 'Mountainbike, landsvägscykel eller avslappnade cykelturer', aktiviteter_category_id, 'Sport & Fitness'),
    ('Yoga & Pilates', 'Gemensam yoga, pilates eller mindfulness', aktiviteter_category_id, 'Sport & Fitness'),
    ('Kampsport', 'Självförsvar, boxning, aikido eller andra kampsporter', aktiviteter_category_id, 'Sport & Fitness'),
    ('Crossfit & Funktionell träning', 'Intensiv träning och utmaningar tillsammans', aktiviteter_category_id, 'Sport & Fitness'),
    ('Dans som träning', 'Zumba, aerobics eller dansfitness', aktiviteter_category_id, 'Sport & Fitness'),
    
    -- VINTERAKTIVITETER
    ('Skidåkning - Utförsåkning', 'Alpina pister och skidorter', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Skidåkning - Längdskidor', 'Klassisk eller skate på preparerade spår', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Snowboard', 'Snowboarding på berg eller i parker', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Skridskoåkning', 'Naturis, konstfrusna banor eller konståkning', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Skoterkörning', 'Guidadle turer eller egna skoterupplevelser', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Hundspann & Rensläde', 'Unika vinterupplevelser med djur', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Vinterbad & Bastu', 'Kallbad, vinterbad och bastutraditioner', aktiviteter_category_id, 'Vinteraktiviteter'),
    ('Snöskovandring', 'Lugna vandringar i vinterlandskap', aktiviteter_category_id, 'Vinteraktiviteter'),
    
    -- VATTENAKTIVITETER
    ('Kajak & Kanot', 'Paddling i sjöar, åar eller skärgård', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Segling', 'Segelbåt, jollesegling eller större båtar', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Surfing & Windsurfing', 'Vågsurfing eller vindsurfing på sjöar och hav', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Stand Up Paddle (SUP)', 'SUP-boarding på lugnt vatten', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Dyka & Snorkla', 'Upptäck undervattensvärlden tillsammans', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Fiske', 'Sportfiske, flugfiske eller avslappnad fiske', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Vattenski & Wakeboard', 'Fartfyllda vattenaktiviteter bakom båt', aktiviteter_category_id, 'Vattenaktiviteter'),
    ('Rafting', 'Äventyr i forsande vatten', aktiviteter_category_id, 'Vattenaktiviteter'),
    
    -- NATURÄVENTYR
    ('Vandring & Trekking', 'Dagsvandringar eller flerdagars trekkingar', aktiviteter_category_id, 'Naturäventyr'),
    ('Bergsklättring', 'Utomhusklättring på riktiga berg', aktiviteter_category_id, 'Naturäventyr'),
    ('Camping & Tältning', 'Övernattning i naturen', aktiviteter_category_id, 'Naturäventyr'),
    ('Bushcraft & Survival', 'Lära sig överleva och trivas i naturen', aktiviteter_category_id, 'Naturäventyr'),
    ('Fågelskådning', 'Upptäck och fotografera fåglar', aktiviteter_category_id, 'Naturäventyr'),
    ('Geocaching', 'Modern skattjakt med GPS', aktiviteter_category_id, 'Naturäventyr'),
    ('Orientering', 'Navigera med karta och kompass', aktiviteter_category_id, 'Naturäventyr'),
    ('Naturfotografering', 'Fånga naturens skönhet på bild', aktiviteter_category_id, 'Naturäventyr'),
    ('Stjärnkikande', 'Astronomi och nattens mysterier', aktiviteter_category_id, 'Naturäventyr'),
    ('Svamp- & Bärplockning', 'Samla naturens egna delikatesser', aktiviteter_category_id, 'Naturäventyr'),
    
    -- EXTREMSPORT
    ('Fallskärmshoppning', 'Adrenalinkick från höga höjder', aktiviteter_category_id, 'Extremsport'),
    ('Bungyjump', 'Ultimata freefall-upplevelsen', aktiviteter_category_id, 'Extremsport'),
    ('Paragliding', 'Glida genom luften med vindkraft', aktiviteter_category_id, 'Extremsport'),
    ('Motorcykelkörning', 'Touring, racing eller off-road', aktiviteter_category_id, 'Extremsport'),
    ('Speedway & Karting', 'Racing på bana med olika fordon', aktiviteter_category_id, 'Extremsport'),
    ('Zipline & Klipputmaningar', 'Linbanor och via ferratas', aktiviteter_category_id, 'Extremsport'),
    ('Paintball & Lasergame', 'Taktiska lekar och skjutspel', aktiviteter_category_id, 'Extremsport'),
    ('Parkour & Freerunning', 'Rörelse genom urbana miljöer', aktiviteter_category_id, 'Extremsport'),
    
    -- KREATIVA AKTIVITETER
    ('Målning & Teckning', 'Konst tillsammans eller ta kurser', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Keramik & Skulptering', 'Arbeta med lera och andra material', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Fotografering', 'Lära sig fotografi eller utforska nya tekniker', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Musik & Instrument', 'Spela tillsammans eller lära sig nytt instrument', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Dans & Koreografi', 'Olika dansstilar från ballroom till streetdance', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Teater & Drama', 'Improvisationsteater eller amatörteater', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Skrivande & Poesi', 'Kreativt skrivande eller journaling tillsammans', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Hantverk & DIY', 'Bygga, sy, snickra eller andra hantverksprojekt', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Trädgårdsarbete', 'Odla tillsammans, plantera eller landscaping', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    ('Matlagning & Bakning', 'Experimentera med nya recept och tekniker', aktiviteter_category_id, 'Kreativa Aktiviteter'),
    
    -- SPEL & UNDERHÅLLNING
    ('Brädspel & Kortspel', 'Strategispel, party games eller klassiska kortspel', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Videospel', 'Co-op spel, MMO eller competitive gaming', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Escape Rooms', 'Lösa gåtor och fly från låsta rum', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Quiz & Trivia', 'Testa kunskaper på pubar eller hemma', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Bowling', 'Klassisk bowling eller disco bowling', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Biljard & Snooker', 'Pool, snooker eller andra biljardspel', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Arkadspel', 'Retro arkadhallar eller moderna gaming centers', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Minigolf', 'Crazy golf eller adventure golf', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Karaoke', 'Sjunga tillsammans på karaokebar eller hemma', aktiviteter_category_id, 'Spel & Underhållning'),
    ('Stand-up & Comedy', 'Gå på komedishow eller prova själva', aktiviteter_category_id, 'Spel & Underhållning'),
    
    -- KULTUR & UTBILDNING
    ('Museer & Gallerier', 'Konstmuseer, historiska museer eller specialutställningar', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Teater & Opera', 'Pjäser, opera, musikaler eller andra föreställningar', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Konserter & Festivaler', 'Livemusik från klassiskt till elektronisk musik', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Kurser & Workshops', 'Lära sig nya färdigheter tillsammans', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Språkutbyte', 'Träffa människor och öva språk', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Bokklubbar', 'Läsa och diskutera böcker tillsammans', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Föreläsningar & Talks', 'TED talks, universitetsföreläsningar eller företagsevent', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Historiska Platser', 'Besöka slott, ruiner eller kulturarv', aktiviteter_category_id, 'Kultur & Utbildning'),
    ('Religiösa & Andliga Platser', 'Kyrkor, tempel eller andra andliga upplevelser', aktiviteter_category_id, 'Kultur & Utbildning'),
    
    -- WELLNESS & AVKOPPLING
    ('Spa & Massage', 'Avkoppling och välmående tillsammans', aktiviteter_category_id, 'Wellness & Avkoppling'),
    ('Meditation & Mindfulness', 'Lugn och närvaro i vardagen', aktiviteter_category_id, 'Wellness & Avkoppling'),
    ('Naturens Välmående', 'Skogsbad, grounding eller eco-therapy', aktiviteter_category_id, 'Wellness & Avkoppling'),
    ('Andliga Retreats', 'Yoga retreats eller andliga upplevelser', aktiviteter_category_id, 'Wellness & Avkoppling'),
    ('Termalbadar & Heta Källor', 'Naturliga varma källor eller spa-anläggningar', aktiviteter_category_id, 'Wellness & Avkoppling'),
    ('Akupunktur & Alternativ Medicin', 'Holistiska behandlingar tillsammans', aktiviteter_category_id, 'Wellness & Avkoppling'),
    
    -- TEKNOLOGI & INNOVATION
    ('VR & AR Upplevelser', 'Virtual reality gaming eller augmented reality', aktiviteter_category_id, 'Teknologi & Innovation'),
    ('Dronflygning', 'Lära sig flyga drönare och filma', aktiviteter_category_id, 'Teknologi & Innovation'),
    ('Robotik & Programmering', 'Bygga och programmera tillsammans', aktiviteter_category_id, 'Teknologi & Innovation'),
    ('Tech Meetups', 'Nätverka och lära sig om ny teknologi', aktiviteter_category_id, 'Teknologi & Innovation'),
    ('Podcasting', 'Starta egen podcast eller delta i inspelningar', aktiviteter_category_id, 'Teknologi & Innovation'),
    ('3D-printning', 'Designa och printa egna saker', aktiviteter_category_id, 'Teknologi & Innovation'),
    
    -- DJUR & NATUR
    ('Djurparker & Zoo', 'Besöka och lära sig om djur', aktiviteter_category_id, 'Djur & Natur'),
    ('Hästridning', 'Ridlektioner eller turer till häst', aktiviteter_category_id, 'Djur & Natur'),
    ('Hundkurser', 'Träna hundar eller delta i hundaktiviteter', aktiviteter_category_id, 'Djur & Natur'),
    ('Fågelholkar & Matning', 'Bygga fågelholkar och mata fåglar', aktiviteter_category_id, 'Djur & Natur'),
    ('Akvarium & Marint Liv', 'Besöka akvarier eller snorkla för att se fiskar', aktiviteter_category_id, 'Djur & Natur'),
    ('Bondgårdsbesök', 'Lära sig om lantbruk och jordbruk', aktiviteter_category_id, 'Djur & Natur'),
    
    -- SÄSONGS AKTIVITETER
    ('Jul & Vinter Traditioner', 'Julmarknader, ice bars och vinteraktiviteter', aktiviteter_category_id, 'Säsongs Aktiviteter'),
    ('Påsk & Vår Firande', 'Påskaktiviteter och vårfirande', aktiviteter_category_id, 'Säsongs Aktiviteter'),
    ('Midsommar & Sommar', 'Svenska sommartraditioner och utomhusfester', aktiviteter_category_id, 'Säsongs Aktiviteter'),
    ('Halloween & Spöktraditioner', 'Skräckaktiviteter och höstmys', aktiviteter_category_id, 'Säsongs Aktiviteter'),
    ('Nationaldagar & Firanden', 'Olika länders nationaldag och kulturella firanden', aktiviteter_category_id, 'Säsongs Aktiviteter');
    
END $$;