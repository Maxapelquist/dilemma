-- Lägg till kategorier
INSERT INTO public.categories (name, icon, description) VALUES
('Mat & Dryck', '🍷', 'Upptäck nya restauranger, recept och kulinariska upplevelser tillsammans'),
('Aktiviteter', '🏃‍♂️', 'Hitta roliga aktiviteter att göra tillsammans - sport, hobbies och äventyr'),
('Kultur & Nöje', '🎭', 'Utforska konst, musik, teater, filmer och kulturella upplevelser'),
('Resor', '✈️', 'Planera drömresor och upptäck nya destinationer tillsammans'),
('Hem & Livsstil', '🏠', 'Skapa ett gemensamt hem och livsstil som passar er båda'),
('Hälsa & Välbefinnande', '🧘‍♀️', 'Fokusera på hälsa, träning och mental välbefinnande tillsammans'),
('Romantik', '💕', 'Romantic aktiviteter och sätt att stärka er relation'),
('Vänskap & Socialt', '👥', 'Träffa vänner och sociala aktiviteter ni kan njuta av tillsammans');

-- Lägg till preferens-alternativ för Mat & Dryck
INSERT INTO public.preference_options (title, description) VALUES
('Fine dining-restauranger', 'Exklusiva restauranger med utsökt mat och service'),
('Street food & food trucks', 'Casual och autentisk mat från gatan'),
('Hemlagad matlagning', 'Laga mat tillsammans hemma'),
('Vinprovning', 'Upptäck nya viner och lär er om vinkultur'),
('Craft beer & bryggeribesök', 'Utforska lokala bryggerier och specialöl'),
('Vegetariansk/vegansk mat', 'Växtbaserade måltider och restauranger'),
('Internationell mat', 'Utforska olika kök från hela världen'),
('Bakning & desserter', 'Skapa söta läckerheter tillsammans'),
('Cocktail bars', 'Upptäck kreativa drinkar och atmosfäriska barer'),
('Farmers markets', 'Handla lokala råvaror och träffa producenter');

-- Lägg till preferens-alternativ för Aktiviteter
INSERT INTO public.preference_options (title, description) VALUES
('Hiking & vandring', 'Utforska naturen till fots'),
('Cykling', 'Upptäck nya platser på cykel'),
('Yoga & meditation', 'Träna mindfulness och kroppsbalans tillsammans'),
('Gym & styrketräning', 'Träna och motivera varandra'),
('Dans', 'Lär er nya danser eller gå ut och dansa'),
('Klättring', 'Utmana er själva både inomhus och utomhus'),
('Vattensporter', 'Simma, paddla eller andra vattenaktiviteter'),
('Vintersport', 'Skidåkning, skridskor och andra vinteraktiviteter'),
('Fotografering', 'Fånga minnen och utforska fotografi tillsammans'),
('Gaming', 'Spela video- eller brädspel tillsammans');

-- Lägg till preferens-alternativ för Kultur & Nöje
INSERT INTO public.preference_options (title, description) VALUES
('Museer & gallerier', 'Utforska konst, historia och kultur'),
('Teater & föreställningar', 'Se pjäser, musikaler och andra scenkonst'),
('Konserter & livemusik', 'Upplev musik live tillsammans'),
('Film & bio', 'Se filmer hemma eller på bio'),
('Festivaler', 'Delta i musik-, mat- eller kulturfestivaler'),
('Standup & komedi', 'Skratta tillsammans på komedishower'),
('Bokklubbar & läsning', 'Dela litterära upplevelser'),
('Podcasts', 'Lyssna på intressanta podcasts tillsammans'),
('Trivia nights', 'Testa era kunskaper på pub quiz'),
('Antikmarknader', 'Leta skatter på loppisar och antikmarknader');

-- Lägg till preferens-alternativ för Resor
INSERT INTO public.preference_options (title, description) VALUES
('Stadsresor', 'Utforska nya städer och deras kultur'),
('Naturresor', 'Camping, nationalparker och vildmark'),
('Strandresor', 'Koppla av vid havet eller sjöar'),
('Äventyrsresor', 'Adrenalinfyllda upplevelser och extremsport'),
('Kulturresor', 'Djupdyka i historia och lokala traditioner'),
('Matresor', 'Resa för att uppleva lokal mat och dryck'),
('Spa & wellness-resor', 'Fokusera på avkoppling och återhämtning'),
('Roadtrips', 'Spontana bilresor och frihet på vägarna'),
('Backpacking', 'Budget-vänligt resande med ryggsäck'),
('Lyxresor', 'Skäm bort er med exklusiva upplevelser');

-- Lägg till preferens-alternativ för Hem & Livsstil
INSERT INTO public.preference_options (title, description) VALUES
('Inredning & design', 'Skapa ett vackert hem tillsammans'),
('Trädgårdsarbete', 'Odla växter och skapa en grön oas'),
('DIY-projekt', 'Bygga och skapa saker med egna händer'),
('Minimalism', 'Leva enkelt med mindre saker'),
('Vintage & retro', 'Samla och uppskatta gamla föremål'),
('Smart home-teknik', 'Automatisera och modernisera hemmet'),
('Hållbarhet & miljötänk', 'Leva mer miljövänligt tillsammans'),
('Husdjur', 'Dela ansvaret för älskade fyrbenta familjemedlemmar'),
('Samlarhobbies', 'Samla föremål som ni båda uppskattar'),
('Renovering', 'Förbättra och förnya ert hem');

-- Lägg till preferens-alternativ för Hälsa & Välbefinnande
INSERT INTO public.preference_options (title, description) VALUES
('Morgonrutiner', 'Starta dagen rätt tillsammans'),
('Meditation & mindfulness', 'Träna mental närvaro och lugn'),
('Hälsosam matlagning', 'Laga näringsrik mat tillsammans'),
('Spa-hemmakvällar', 'Skäm bort varandra hemma'),
('Mental hälsa', 'Stötta varandra i välbefinnande'),
('Sömnhygien', 'Skapa goda sovvanor tillsammans'),
('Detox & rening', 'Rensa kropp och sinne periodiskt'),
('Naturmedicin', 'Utforska naturliga hälsometoder'),
('Fitness challenges', 'Utmana er själva med träning'),
('Stresshantering', 'Lära sig hantera stress tillsammans');

-- Lägg till preferens-alternativ för Romantik
INSERT INTO public.preference_options (title, description) VALUES
('Date nights hemma', 'Romantiska kvällar i hemkänsla'),
('Romantiska restauranger', 'Speciella middagar på romantiska platser'),
('Solnedgångar & soluppgångar', 'Dela magiska stunder i naturens ljus'),
('Paraktiviteter', 'Aktiviteter designade för par'),
('Överraskningar', 'Planera speciella överraskningar för varandra'),
('Kärleksbrev & meddelanden', 'Uttrycka kärlek genom ord'),
('Romantiska filmer', 'Mys med kärleksfilmer tillsammans'),
('Picknick', 'Romantiska utomhusmåltider'),
('Hot air balloon', 'Äventyrliga romantiska upplevelser'),
('Romantiska spa-dagar', 'Koppla av tillsammans på spa');

-- Lägg till preferens-alternativ för Vänskap & Socialt
INSERT INTO public.preference_options (title, description) VALUES
('Game nights', 'Träffa vänner för spel och skratt'),
('Middag med vänner', 'Bjud hem eller träffas på restaurang'),
('Dubbeldejtningar', 'Träffa andra par för roliga aktiviteter'),
('Föreningsliv', 'Delta i klubbar och organisationer'),
('Networking events', 'Träffa nya människor professionellt'),
('Karaoke', 'Sjunga och ha kul med vänner'),
('Sportevenemang', 'Se matcher och tävlingar tillsammans'),
('Volontärarbete', 'Hjälpa andra och göra skillnad tillsammans'),
('Partiplanering', 'Arrangera fester och sammankomster'),
('Community events', 'Delta i lokala evenemang och aktiviteter');