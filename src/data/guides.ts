import type { Lang } from "@/lib/i18n";

/** Texte bilingue. */
export type Bi = { fr: string; en: string };

const b = (fr: string, en: string): Bi => ({ fr, en });

export type GuideSection = {
  h: Bi;
  p: Bi[];
  /** Puces optionnelles. */
  li?: Bi[];
};

export type Guide = {
  slug: string;
  /** Slug du domaine de soin associé (sexuel | poids | cheveux | peau). */
  domaine: "sexuel" | "poids" | "cheveux" | "peau";
  categorie: Bi;
  titre: Bi;
  chapo: Bi;
  /** Temps de lecture indicatif, en minutes. */
  lecture: number;
  keywords: string[];
  sections: GuideSection[];
  faq: { q: Bi; r: Bi }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "troubles-erection-causes-traitements",
    domaine: "sexuel",
    categorie: b("Santé sexuelle", "Sexual health"),
    titre: b(
      "Troubles de l'érection : causes, examens et traitements",
      "Erectile dysfunction: causes, check-ups and treatments",
    ),
    chapo: b(
      "Pourquoi une érection peut manquer, ce que cela dit de votre santé générale, et quels traitements un médecin peut prescrire.",
      "Why an erection can fail, what it says about your general health, and which treatments a doctor may prescribe.",
    ),
    lecture: 6,
    keywords: [
      "troubles de l'érection",
      "dysfonction érectile",
      "cause panne érection",
      "traitement érection homme",
      "sildénafil ordonnance",
      "tadalafil en ligne",
    ],
    sections: [
      {
        h: b("Ce qu'on appelle un trouble de l'érection", "What counts as erectile dysfunction"),
        p: [
          b(
            "On parle de trouble de l'érection lorsque la difficulté à obtenir ou maintenir une érection suffisante pour un rapport se répète pendant plusieurs semaines. Un épisode isolé, après une soirée alcoolisée, une période de stress ou une nuit courte, n'a rien d'anormal.",
            "Erectile dysfunction describes difficulty getting or keeping an erection firm enough for sex, repeated over several weeks. An isolated episode after alcohol, stress or a short night is not abnormal.",
          ),
          b(
            "La fréquence augmente avec l'âge, mais l'âge seul n'explique pas tout : environ un homme sur deux entre 40 et 70 ans rapporte des difficultés à un moment donné.",
            "Frequency increases with age, but age alone does not explain everything: roughly one man in two aged 40 to 70 reports difficulties at some point.",
          ),
        ],
      },
      {
        h: b("Les causes les plus fréquentes", "The most common causes"),
        p: [
          b(
            "L'érection dépend d'un afflux sanguin, d'un système nerveux qui le déclenche et d'un équilibre hormonal. Un trouble peut venir de l'un ou de plusieurs de ces niveaux à la fois.",
            "An erection depends on blood flow, on the nervous system that triggers it, and on hormonal balance. A problem can arise at one or several of these levels at once.",
          ),
        ],
        li: [
          b("Vasculaire : hypertension, cholestérol, tabac, diabète.", "Vascular: high blood pressure, cholesterol, smoking, diabetes."),
          b("Psychologique : stress, anxiété de performance, dépression, conflit de couple.", "Psychological: stress, performance anxiety, depression, relationship conflict."),
          b("Hormonale : déficit en testostérone, trouble thyroïdien.", "Hormonal: low testosterone, thyroid disorder."),
          b("Médicamenteuse : certains antidépresseurs, bêtabloquants, traitements de la prostate.", "Medication-related: some antidepressants, beta-blockers, prostate treatments."),
          b("Mode de vie : sommeil insuffisant, sédentarité, alcool, cannabis.", "Lifestyle: poor sleep, inactivity, alcohol, cannabis."),
        ],
      },
      {
        h: b("Un signal d'alerte cardiovasculaire", "A cardiovascular warning sign"),
        p: [
          b(
            "Les artères du pénis sont fines : elles se ferment souvent avant les artères coronaires. Un trouble de l'érection installé chez un homme de moins de 60 ans mérite donc un bilan tensionnel, glycémique et lipidique. C'est l'une des raisons pour lesquelles un médecin doit rester dans la boucle, même quand le traitement paraît évident.",
            "The arteries in the penis are narrow: they often close before coronary arteries do. Persistent erectile dysfunction in a man under 60 therefore warrants blood pressure, blood sugar and lipid checks. That is one reason a doctor should stay involved, even when the treatment seems obvious.",
          ),
        ],
      },
      {
        h: b("Les traitements sur ordonnance", "Prescription treatments"),
        p: [
          b(
            "Les inhibiteurs de la PDE5 (sildénafil, tadalafil) améliorent l'afflux sanguin en réponse à une stimulation sexuelle : ils ne créent pas le désir. Le sildénafil agit en 30 à 60 minutes sur environ 4 à 6 heures ; le tadalafil couvre une fenêtre nettement plus longue.",
            "PDE5 inhibitors (sildenafil, tadalafil) improve blood flow in response to sexual stimulation: they do not create desire. Sildenafil works within 30 to 60 minutes for around 4 to 6 hours; tadalafil covers a much longer window.",
          ),
          b(
            "Ces molécules sont contre-indiquées avec les dérivés nitrés et demandent une prudence particulière en cas de maladie cardiaque instable. Leur délivrance suppose une ordonnance : c'est exactement ce que le questionnaire médical MAAN puis la consultation en ligne servent à évaluer.",
            "These molecules are contraindicated with nitrates and require particular caution in unstable heart disease. They are prescription-only: this is precisely what the MAAN medical questionnaire and the online consultation are designed to assess.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Peut-on acheter du sildénafil sans ordonnance ?", "Can you buy sildenafil without a prescription?"),
        r: b(
          "Non. Le sildénafil est un médicament soumis à prescription médicale. Chez MAAN, un médecin l'évalue à partir de votre questionnaire et d'une consultation en ligne avant toute délivrance.",
          "No. Sildenafil is a prescription-only medicine. At MAAN a doctor reviews your questionnaire and holds an online consultation before anything is dispensed.",
        ),
      },
      {
        q: b("Le trouble de l'érection est-il définitif ?", "Is erectile dysfunction permanent?"),
        r: b(
          "Rarement. Beaucoup de situations s'améliorent en traitant la cause : sommeil, tabac, tension, anxiété, ou en adaptant un médicament en cours.",
          "Rarely. Many cases improve once the cause is addressed: sleep, smoking, blood pressure, anxiety, or by adjusting an existing medication.",
        ),
      },
    ],
  },
  {
    slug: "ejaculation-precoce-comprendre-agir",
    domaine: "sexuel",
    categorie: b("Santé sexuelle", "Sexual health"),
    titre: b(
      "Éjaculation précoce : comprendre et agir",
      "Premature ejaculation: understanding and acting",
    ),
    chapo: b(
      "Le motif de consultation sexuelle le plus fréquent chez l'homme jeune — et l'un des plus accessibles à un traitement.",
      "The most common sexual health complaint among younger men, and one of the most treatable.",
    ),
    lecture: 5,
    keywords: [
      "éjaculation précoce",
      "traitement éjaculation précoce",
      "durer plus longtemps homme",
      "dapoxétine",
    ],
    sections: [
      {
        h: b("Une définition clinique, pas une comparaison", "A clinical definition, not a comparison"),
        p: [
          b(
            "On retient l'éjaculation précoce lorsqu'elle survient très rapidement après la pénétration, de façon non contrôlée et répétée, et qu'elle génère une gêne personnelle ou relationnelle. Ce dernier critère compte autant que le chronomètre.",
            "Premature ejaculation is defined by ejaculation occurring very soon after penetration, uncontrolled and repeated, and causing personal or relationship distress. That last criterion matters as much as the stopwatch.",
          ),
          b(
            "Environ un homme sur trois s'y reconnaît à un moment de sa vie, tous âges confondus.",
            "About one man in three recognises himself in this at some point, across all ages.",
          ),
        ],
      },
      {
        h: b("Primaire ou secondaire", "Lifelong or acquired"),
        p: [
          b(
            "Présente depuis les premiers rapports, elle est dite primaire et souvent liée à une sensibilité neurologique. Apparue après une période normale, elle est secondaire : on cherche alors une cause récente — anxiété, trouble de l'érection associé, hyperthyroïdie, prostatite, changement de vie.",
            "Present since the first sexual experiences, it is called lifelong and is often linked to neurological sensitivity. Appearing after a normal period, it is acquired: the search then focuses on a recent cause — anxiety, associated erectile dysfunction, hyperthyroidism, prostatitis, life change.",
          ),
        ],
      },
      {
        h: b("Ce qui fonctionne", "What works"),
        p: [
          b(
            "Les approches comportementales (technique stop-start, respiration, travail du plancher pelvien) donnent de bons résultats, surtout combinées. Côté médicaments, la dapoxétine, ISRS à action courte, se prend à la demande une à trois heures avant le rapport, sur prescription.",
            "Behavioural approaches (stop-start technique, breathing, pelvic floor work) work well, especially combined. On the medication side, dapoxetine, a short-acting SSRI, is taken on demand one to three hours before intercourse, on prescription.",
          ),
          b(
            "Quand un trouble de l'érection coexiste, on le traite d'abord : la peur de perdre l'érection accélère souvent l'éjaculation.",
            "When erectile dysfunction coexists, it is treated first: fear of losing the erection often speeds up ejaculation.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Combien de temps est « normal » ?", "How long is “normal”?"),
        r: b(
          "Il n'existe pas de norme. Ce qui compte, c'est le contrôle ressenti et la gêne provoquée, pas une durée chiffrée.",
          "There is no norm. What matters is your sense of control and the distress caused, not a number of minutes.",
        ),
      },
    ],
  },
  {
    slug: "chute-de-cheveux-homme-alopecie-androgenetique",
    domaine: "cheveux",
    categorie: b("Cheveux", "Hair"),
    titre: b(
      "Chute de cheveux chez l'homme : reconnaître l'alopécie androgénétique",
      "Male hair loss: recognising androgenetic alopecia",
    ),
    chapo: b(
      "Golfes qui reculent, vertex qui s'éclaircit : comment distinguer une calvitie héréditaire d'une chute passagère, et quand agir.",
      "Receding temples, thinning crown: how to tell hereditary balding from temporary shedding, and when to act.",
    ),
    lecture: 6,
    keywords: [
      "chute de cheveux homme",
      "calvitie",
      "alopécie androgénétique",
      "finastéride",
      "minoxidil",
      "traitement calvitie en ligne",
    ],
    sections: [
      {
        h: b("Le mécanisme", "The mechanism"),
        p: [
          b(
            "Sous l'effet de la DHT, un dérivé de la testostérone, les follicules sensibles se miniaturisent : les cheveux repoussent plus fins, plus courts, puis plus du tout. Le processus est progressif et suit un dessin reconnaissable — tempes puis vertex — décrit par l'échelle de Norwood.",
            "Under the influence of DHT, a testosterone derivative, sensitive follicles miniaturise: hair grows back thinner, shorter, then not at all. The process is gradual and follows a recognisable pattern — temples then crown — described by the Norwood scale.",
          ),
        ],
      },
      {
        h: b("Ce qui n'est pas une calvitie", "What is not balding"),
        p: [
          b(
            "Une chute diffuse et brutale, deux à trois mois après une forte fièvre, une opération, un régime strict ou un choc, évoque plutôt un effluvium télogène : elle se corrige souvent seule. Des plaques nettes et rondes orientent vers une pelade. Des démangeaisons et des squames, vers une dermite. Ces situations demandent un avis médical distinct.",
            "Sudden diffuse shedding two to three months after high fever, surgery, a strict diet or a shock suggests telogen effluvium instead: it often resolves on its own. Sharp round patches point to alopecia areata. Itching and flaking point to dermatitis. These situations need a separate medical opinion.",
          ),
        ],
      },
      {
        h: b("Finastéride et minoxidil", "Finasteride and minoxidil"),
        p: [
          b(
            "Le finastéride, en comprimé, réduit la conversion de testostérone en DHT et stabilise la chute chez une large majorité d'hommes traités. Le minoxidil, en application locale, prolonge la phase de croissance et densifie. Les deux sont souvent associés.",
            "Finasteride, a tablet, reduces the conversion of testosterone into DHT and stabilises hair loss in a large majority of treated men. Minoxidil, applied topically, extends the growth phase and increases density. The two are often combined.",
          ),
          b(
            "Deux règles à connaître : les premiers résultats visibles demandent trois à six mois, et l'arrêt du traitement fait reprendre la chute là où elle en serait sans traitement. Le finastéride est un médicament sur ordonnance, avec des effets indésirables sexuels rares mais à discuter avec le médecin.",
            "Two rules to know: visible results take three to six months, and stopping treatment resumes hair loss where it would have been untreated. Finasteride is a prescription medicine, with rare sexual side effects that should be discussed with the doctor.",
          ),
        ],
      },
      {
        h: b("Agir tôt", "Acting early"),
        p: [
          b(
            "Un follicule miniaturisé peut être relancé ; un follicule disparu, non. C'est la seule raison pour laquelle le délai compte plus que le choix exact du produit.",
            "A miniaturised follicle can be revived; a lost follicle cannot. That is the only reason timing matters more than the exact choice of product.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Le finastéride rend-il impuissant ?", "Does finasteride cause impotence?"),
        r: b(
          "Les effets indésirables sexuels sont rapportés par une petite minorité d'utilisateurs et sont généralement réversibles à l'arrêt. Ils doivent être évoqués avec le médecin lors de la consultation.",
          "Sexual side effects are reported by a small minority of users and are generally reversible on stopping. They should be raised with the doctor during the consultation.",
        ),
      },
      {
        q: b("Combien de temps avant de voir un résultat ?", "How long before results?"),
        r: b(
          "Comptez trois mois pour une stabilisation et six à douze mois pour juger la densité.",
          "Expect three months for stabilisation and six to twelve months to judge density.",
        ),
      },
    ],
  },
  {
    slug: "perte-de-poids-homme-methode-medicale",
    domaine: "poids",
    categorie: b("Poids", "Weight"),
    titre: b(
      "Perte de poids chez l'homme : ce qu'une approche médicale change",
      "Weight loss in men: what a medical approach changes",
    ),
    chapo: b(
      "IMC, tour de taille, graisse viscérale : les repères qui comptent vraiment, et le cadre dans lequel un traitement peut être prescrit.",
      "BMI, waist circumference, visceral fat: the markers that really matter, and the setting in which treatment can be prescribed.",
    ),
    lecture: 6,
    keywords: [
      "perte de poids homme",
      "IMC homme",
      "tour de taille",
      "traitement surpoids ordonnance",
      "programme perte de poids médical",
    ],
    sections: [
      {
        h: b("Mesurer autrement", "Measuring differently"),
        p: [
          b(
            "L'IMC reste un repère utile mais grossier : il ne distingue pas muscle et graisse. Chez l'homme, le tour de taille est souvent plus parlant, car il reflète la graisse viscérale, celle qui entoure les organes et pèse le plus sur la tension, le foie et le risque de diabète.",
            "BMI remains a useful but crude marker: it does not distinguish muscle from fat. In men, waist circumference often says more, because it reflects visceral fat, the kind that surrounds organs and weighs most on blood pressure, the liver and diabetes risk.",
          ),
        ],
      },
      {
        h: b("Pourquoi les régimes seuls échouent souvent", "Why diets alone often fail"),
        p: [
          b(
            "Une restriction rapide fait chuter la dépense énergétique de repos et augmente les signaux de faim. Le corps défend son poids antérieur : ce n'est pas un manque de volonté, c'est une régulation biologique. Une approche durable combine déficit modéré, apport protéique suffisant, renforcement musculaire et sommeil.",
            "Rapid restriction lowers resting energy expenditure and increases hunger signals. The body defends its previous weight: this is not a lack of willpower, it is biological regulation. A sustainable approach combines a moderate deficit, sufficient protein, resistance training and sleep.",
          ),
        ],
      },
      {
        h: b("Quand un traitement entre en jeu", "When medication comes in"),
        p: [
          b(
            "Un traitement médicamenteux se discute au-dessus de certains seuils d'IMC, ou plus bas en présence de complications comme un prédiabète, une hypertension ou une apnée du sommeil. Il ne remplace jamais les mesures de fond : il rend le déficit tenable en agissant sur l'appétit et la satiété.",
            "Medication is discussed above certain BMI thresholds, or lower when complications such as prediabetes, hypertension or sleep apnoea are present. It never replaces the underlying measures: it makes the deficit sustainable by acting on appetite and satiety.",
          ),
          b(
            "La prescription suppose un examen des antécédents personnels et familiaux, des médicaments en cours et parfois d'un bilan biologique. Le suivi régulier fait partie du traitement, pas d'une option.",
            "Prescribing requires reviewing personal and family history, current medication and sometimes blood tests. Regular follow-up is part of the treatment, not an option.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Quel rythme de perte est raisonnable ?", "What rate of weight loss is reasonable?"),
        r: b(
          "Un rythme d'environ 0,5 à 1 % du poids corporel par semaine est généralement considéré comme soutenable et mieux maintenu dans le temps.",
          "Around 0.5 to 1% of body weight per week is generally considered sustainable and better maintained over time.",
        ),
      },
    ],
  },
  {
    slug: "acne-adulte-homme-traitements",
    domaine: "peau",
    categorie: b("Peau", "Skin"),
    titre: b(
      "Acné de l'adulte chez l'homme : routines et traitements",
      "Adult acne in men: routines and treatments",
    ),
    chapo: b(
      "Boutons persistants après 25 ans : ce qui les entretient, ce qui les aggrave, et ce qu'un médecin peut prescrire.",
      "Persistent breakouts after 25: what keeps them going, what makes them worse, and what a doctor can prescribe.",
    ),
    lecture: 5,
    keywords: [
      "acné adulte homme",
      "traitement acné ordonnance",
      "trétinoïne",
      "routine peau homme",
    ],
    sections: [
      {
        h: b("Quatre facteurs, un même bouton", "Four factors, one spot"),
        p: [
          b(
            "L'acné associe une production de sébum accrue, une obstruction du canal pilaire, la prolifération de Cutibacterium acnes et une inflammation. Agir sur un seul de ces quatre leviers explique la plupart des traitements qui déçoivent.",
            "Acne combines increased sebum production, blockage of the follicle, proliferation of Cutibacterium acnes and inflammation. Acting on only one of these four levers explains most disappointing treatments.",
          ),
        ],
      },
      {
        h: b("Ce qui aggrave sans qu'on y pense", "What makes it worse without you noticing"),
        p: [],
        li: [
          b("Nettoyants agressifs et alcool à 70° : la peau surcompense en sébum.", "Harsh cleansers and rubbing alcohol: the skin overcompensates with sebum."),
          b("Rasage à sec ou lame émoussée sur zones inflammées.", "Dry shaving or a blunt blade over inflamed areas."),
          b("Casque, casquette et téléphone : frottement et occlusion.", "Helmets, caps and phones: friction and occlusion."),
          b("Compléments de musculation contenant des androgènes.", "Bodybuilding supplements containing androgens."),
        ],
      },
      {
        h: b("Traitements", "Treatments"),
        p: [
          b(
            "En première intention, on associe souvent un rétinoïde local le soir et le peroxyde de benzoyle. Les rétinoïdes topiques comme la trétinoïne normalisent le renouvellement cellulaire et préviennent les nouvelles lésions ; ils demandent une montée en puissance progressive, une protection solaire et sont contre-indiqués en cas de grossesse dans l'entourage direct exposé.",
            "First-line care often combines a topical retinoid in the evening with benzoyl peroxide. Topical retinoids such as tretinoin normalise cell turnover and prevent new lesions; they require gradual introduction, sun protection, and are contraindicated in pregnancy.",
          ),
          b(
            "Les formes nodulaires, cicatricielles ou résistantes relèvent d'un avis dermatologique spécifique. Une consultation en ligne permet précisément de trier ces situations.",
            "Nodular, scarring or resistant forms require a specific dermatology opinion. An online consultation is designed to triage exactly these situations.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Faut-il arrêter les produits laitiers ou le sucre ?", "Should you stop dairy or sugar?"),
        r: b(
          "Les données suggèrent un effet modeste d'une alimentation à index glycémique élevé chez certaines personnes. C'est un ajustement complémentaire, pas un traitement.",
          "Evidence suggests a modest effect of a high-glycaemic diet in some people. It is a complementary adjustment, not a treatment.",
        ),
      },
    ],
  },
  {
    slug: "consultation-medicale-en-ligne-comment-ca-marche",
    domaine: "sexuel",
    categorie: b("Parcours de soin", "Care pathway"),
    titre: b(
      "Consultation médicale en ligne : comment ça marche, vraiment",
      "Online medical consultation: how it actually works",
    ),
    chapo: b(
      "Questionnaire, évaluation par un médecin, ordonnance si elle est justifiée, expédition. Ce qui se passe à chaque étape, et ce qui peut vous être refusé.",
      "Questionnaire, doctor review, prescription when justified, shipping. What happens at each step, and what can be refused.",
    ),
    lecture: 4,
    keywords: [
      "consultation médicale en ligne",
      "ordonnance en ligne",
      "téléconsultation homme",
      "médicament livré à domicile",
    ],
    sections: [
      {
        h: b("Le questionnaire médical", "The medical questionnaire"),
        p: [
          b(
            "Il reprend les questions posées en cabinet : antécédents, traitements en cours, symptômes, facteurs de risque. Les réponses alimentent une évaluation d'éligibilité qui signale au médecin les points à approfondir. Répondre approximativement ne fait gagner de temps à personne : cela déplace le problème vers la consultation.",
            "It covers the same questions asked in a clinic: history, current medication, symptoms, risk factors. Answers feed an eligibility assessment that flags the points a doctor should explore. Answering vaguely saves no one time: it simply moves the problem to the consultation.",
          ),
        ],
      },
      {
        h: b("L'évaluation par un médecin", "The doctor's review"),
        p: [
          b(
            "Un médecin identifiable examine le dossier. Trois issues sont possibles : une prescription, une demande d'informations ou d'examens complémentaires, ou un refus avec orientation. Un refus n'est pas un échec du parcours : c'est le filtre qui rend le service sérieux.",
            "An identifiable doctor reviews the file. Three outcomes are possible: a prescription, a request for more information or tests, or a refusal with referral. A refusal is not a failure of the pathway: it is the filter that makes the service credible.",
          ),
        ],
      },
      {
        h: b("Ordonnance, expédition et suivi", "Prescription, shipping and follow-up"),
        p: [
          b(
            "Lorsque le traitement est prescrit, il est préparé puis expédié sous emballage neutre, généralement sous 48h00 après la consultation médicale en ligne. Le suivi se poursuit dans l'espace patient : messages sécurisés, évolution des symptômes, ajustement éventuel du traitement.",
            "When treatment is prescribed, it is prepared and shipped in neutral packaging, typically within 48 hours of the online medical consultation. Follow-up continues in the patient area: secure messages, symptom tracking, and possible treatment adjustment.",
          ),
        ],
      },
    ],
    faq: [
      {
        q: b("Le paiement a-t-il lieu avant la prescription ?", "Is payment taken before the prescription?"),
        r: b(
          "Non. Le traitement n'est payé qu'une fois prescrit par le médecin.",
          "No. The treatment is only paid for once the doctor has prescribed it.",
        ),
      },
      {
        q: b("Le colis mentionne-t-il le contenu ?", "Does the parcel mention its contents?"),
        r: b(
          "Non. L'emballage est neutre et ne comporte aucune mention du traitement ni du motif médical.",
          "No. Packaging is neutral, with no mention of the treatment or the medical reason.",
        ),
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

export function loc(v: Bi, lang: Lang) {
  return lang === "en" ? v.en : v.fr;
}

export function guideUrl(slug: string) {
  return `/guides/${slug}`;
}
