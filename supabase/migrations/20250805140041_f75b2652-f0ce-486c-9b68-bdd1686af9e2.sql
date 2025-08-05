-- Rensa duplicerade kategorier och behåll bara de nya
DELETE FROM categories WHERE created_at < '2025-08-05 13:56:31';

-- Lägg till category_id kolumn till preference_options
ALTER TABLE preference_options ADD COLUMN category_id UUID REFERENCES categories(id);

-- Rensa alla befintliga preference_options och lägg till nya med kategori-koppling
DELETE FROM preference_options;

-- Hämta category IDs först för att använda dem
-- Mat & Dryck kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('Villa Godthem', 'Exklusiv fine dining med svenska smaker', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Bistro Sjön', 'Mysig restaurang vid vattnet med fransk touch', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Kött & Kött', 'Specialiserat kötthus med perfekta steaks', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Sushi Zen', 'Autentisk japansk sushi-upplevelse', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Pasta Casa', 'Hemkänsla med italienska klassiker', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Vinbaren Nordic', 'Nordiska viner och smårätter', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Street Food Market', 'Olika food trucks på samma plats', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Rooftop Bar 360', 'Cocktails med utsikt över staden', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Bakery Dreams', 'Hantverksbageri med fantastiska desserter', (SELECT id FROM categories WHERE name = 'Mat & Dryck')),
('Craft Beer Co', 'Lokalt bryggeri med egen restaurang', (SELECT id FROM categories WHERE name = 'Mat & Dryck'));

-- Resor kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('Mallorca, Spanien', 'Solsemester med vackra stränder och kultur', (SELECT id FROM categories WHERE name = 'Resor')),
('Lofoten, Norge', 'Dramatiska berg och midnattssol', (SELECT id FROM categories WHERE name = 'Resor')),
('Toscana, Italien', 'Vinyard-resor och kulinariska upplevelser', (SELECT id FROM categories WHERE name = 'Resor')),
('Island - roadtrip', 'Vattenfall, geysirer och nordrsken', (SELECT id FROM categories WHERE name = 'Resor')),
('Tokyo, Japan', 'Kultur, mat och moderna upplevelser', (SELECT id FROM categories WHERE name = 'Resor')),
('Santorini, Grekland', 'Romantiska solnedgångar och vita hus', (SELECT id FROM categories WHERE name = 'Resor')),
('New York, USA', 'Storstadspuls och broadway-shower', (SELECT id FROM categories WHERE name = 'Resor')),
('Bali, Indonesien', 'Tropiskt paradis med spa och yoga', (SELECT id FROM categories WHERE name = 'Resor')),
('Alperna, Schweiz', 'Skidåkning och bergsluften', (SELECT id FROM categories WHERE name = 'Resor')),
('Kreta, Grekland', 'Historie, stränder och grekisk mat', (SELECT id FROM categories WHERE name = 'Resor'));

-- Aktiviteter kategorins preferenser  
INSERT INTO preference_options (title, description, category_id) VALUES
('Klättring på Södermalm', 'Inomhusklättring för alla nivåer', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Kajak i skärgården', 'Paddla mellan öar och upptäck naturen', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Yoga i parken', 'Utomhusyoga under sommaren', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Cykeltur till Gripsholm', 'Dagsutflykt till slottet på cykel', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Danslektioner salsa', 'Lär er dansa salsa tillsammans', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Hiking Sörmlandsleden', 'Vandring på närbelägna leder', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Padel på lokala klubben', 'Prova den populära racketsorten', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Skidåkning Romme Alpin', 'Vinteraktivitet bara en timme bort', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Fotografering i Gamla Stan', 'Lär er fotografera tillsammans', (SELECT id FROM categories WHERE name = 'Aktiviteter')),
('Gaming café', 'Retro- och moderna spel tillsammans', (SELECT id FROM categories WHERE name = 'Aktiviteter'));

-- Kultur & Nöje kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('Kungliga Operan', 'Opera och balett i vacker miljö', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Moderna Museet', 'Modern konst och design', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Cinemateket', 'Arthouse-filmer och klassiker', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Dramaten', 'Sveriges nationalscen för teater', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Fotografiska', 'Samtida fotografi och kultur', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Stockholms Konserthus', 'Klassisk musik i blå salen', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Debaser', 'Livemusik och klubb-atmosfär', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Stand-up på Norra Brunn', 'Komedi och skratt på närma håll', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Hornstulls Marknad', 'Loppis och vintage-fynd', (SELECT id FROM categories WHERE name = 'Kultur & Nöje')),
('Pub quiz på Bishops Arms', 'Testa era kunskaper tillsammans', (SELECT id FROM categories WHERE name = 'Kultur & Nöje'));

-- Hem & Livsstil kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('IKEA-projekt', 'Inreda och möblera tillsammans', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Balkongträdgård', 'Odla örter och blommor på balkongen', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Vintage-jakt på Söder', 'Hitta unika prylar och möbler', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Smart hem-setup', 'Automatisera hemmet med teknik', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Minimalism-challenge', 'Rensa ut och förenkla hemmet', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('DIY-projekt från Pinterest', 'Bygga och skapa tillsammans', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Kompost och återvinning', 'Leva mer hållbart hemma', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Husdjur - katt eller hund?', 'Diskutera och planera husdjur', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Samla LP-skivor', 'Bygga upp en gemensam skivsamling', (SELECT id FROM categories WHERE name = 'Hem & Livsstil')),
('Badrumsrenovering', 'Planera och genomföra renovation', (SELECT id FROM categories WHERE name = 'Hem & Livsstil'));

-- Hälsa & Välbefinnande kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('5:2-dieten tillsammans', 'Prova intervallfasta som par', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Meditation med app', 'Headspace eller Calm tillsammans', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Hemma-spa söndagar', 'Avslappning och skämning hemma', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Yasuragi Hasseludden', 'Japanskt spa och hot bath', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Löpning i Djurgården', 'Morgon- eller kvällsrundar tillsammans', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('SATS träning tillsammans', 'Gym-pass och gruppträning', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Digital detox helger', 'Telefonfria helger tillsammans', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Naturens apotek', 'Utforska örter och naturmedicin', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('10000 steg challenge', 'Daglig promenad-utmaning', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande')),
('Yoga med Adriene', 'Hemma-yoga via YouTube', (SELECT id FROM categories WHERE name = 'Hälsa & Välbefinnande'));

-- Romantik kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('Picknick på Långholmen', 'Romantisk utomhusmiddag med utsikt', (SELECT id FROM categories WHERE name = 'Romantik')),
('Solnedgång från Monteliusvängen', 'Magiska kvällstimmar med stadsvy', (SELECT id FROM categories WHERE name = 'Romantik')),
('Couples massage hemma', 'Massera varandra vid ljus', (SELECT id FROM categories WHERE name = 'Romantik')),
('Date night hemma', 'Laga middag och tända ljus', (SELECT id FROM categories WHERE name = 'Romantik')),
('Kärleksbrev till varandra', 'Uttrycka känslor genom handskrivna brev', (SELECT id FROM categories WHERE name = 'Romantik')),
('Romantisk film-maraton', 'Klassiska kärleksfilmer med godis', (SELECT id FROM categories WHERE name = 'Romantik')),
('Hot air balloon Stockholm', 'Luftballong över staden', (SELECT id FROM categories WHERE name = 'Romantik')),
('Danslektion privat', 'Lär er dansa i avskildhet', (SELECT id FROM categories WHERE name = 'Romantik')),
('Överraskning varje månad', 'Planera små överraskningar', (SELECT id FROM categories WHERE name = 'Romantik')),
('Stjärnkikande utanför stan', 'Upptäck stjärnhimlen tillsammans', (SELECT id FROM categories WHERE name = 'Romantik'));

-- Vänskap & Socialt kategorins preferenser
INSERT INTO preference_options (title, description, category_id) VALUES
('Game night med vänner', 'Bjud hem vänner för brädspel', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Dubbeldejtning middag', 'Träffa andra par för middag', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Karaoke på Sing Along', 'Sjunga och ha kul med gänget', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Bowlingturnering', 'Organisera tävling med vänner', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('BBQ-party hemma', 'Sommargrill med alla kompisar', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Volontärarbete tillsammans', 'Hjälpa andra som par', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Fotbollsmatch på Friends', 'Se match tillsammans med vänner', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('After work träffar', 'Regelbundna träffar efter jobbet', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Escape room challenge', 'Lösa pussel tillsammans med vänner', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt')),
('Hemkväll med närkompisar', 'Avslappnade kvällar hemma med vänner', (SELECT id FROM categories WHERE name = 'Vänskap & Socialt'));