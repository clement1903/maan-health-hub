import produitSildenafil from "@/assets/produit-sildenafil.jpg";
import produitViagra from "@/assets/produit-viagra.jpg";
import produitTadalafil from "@/assets/produit-tadalafil.jpg";
import produitCialis from "@/assets/produit-cialis.jpg";
import produitWegovy from "@/assets/produit-wegovy.jpg";
import produitOzempic from "@/assets/produit-ozempic.jpg";
import produitFinasteride from "@/assets/produit-finasteride.jpg";
import produitMinoxidil from "@/assets/produit-minoxidil.jpg";
import produitTretinoine from "@/assets/produit-tretinoine.jpg";
import produitMetronidazole from "@/assets/produit-metronidazole.jpg";
import soinSexual from "@/assets/soin-sexual.jpg";
import soinWeight from "@/assets/soin-weight.jpg";
import soinHair from "@/assets/soin-hair.jpg";
import soinSkin from "@/assets/soin-skin.jpg";

export type Lang = "fr" | "en";

/** Petite valeur bilingue. */
export type Bi = { fr: string; en: string };

/** Résout une valeur bilingue selon la langue courante. */
export function loc(v: Bi, lang: Lang): string {
  return lang === "en" ? v.en : v.fr;
}

export type ProduitData = {
  /** Identifiant stable, indépendant de la langue (utilisé pour les clés, la recherche et l'URL). */
  id: string;
  nom: Bi;
  molecule: Bi;
  image: string;
  alt: Bi;
  prix: Bi;
  /** Prix d'un achat à l'unité (une boîte / un flacon), en euros. Absent pour la santé sexuelle. */
  prixUnite?: number;
  /** Prix mensuel de base d'un abonnement, en euros. Absent pour la santé sexuelle. */
  prixMensuel?: number;
  forme: Bi;
  posologie: Bi;
  precautions: Bi;
  modeAction: Bi;
  suivi: Bi;
};

export type Produit = {
  id: string;
  nom: string;
  molecule: string;
  image: string;
  alt: string;
  prix: string;
  prixUnite?: number;
  prixMensuel?: number;
  forme: string;
  posologie: string;
  precautions: string;
  modeAction: string;
  suivi: string;
};

export type DomaineData = {
  slug: string;
  key: string;
  tag: string;
  titre: Bi;
  chapo: Bi;
  image: string;
  indications: Bi[];
  produits: ProduitData[];
  faq: { q: Bi; r: Bi }[];
};

export type Domaine = {
  slug: string;
  key: string;
  tag: string;
  titre: string;
  chapo: string;
  image: string;
  indications: string[];
  produits: Produit[];
  faq: { q: string; r: string }[];
};

export const domainesData: DomaineData[] = [
  {
    slug: "sexuel",
    key: "sexual",
    tag: "Sexual Management",
    titre: { fr: "Santé sexuelle", en: "Sexual health" },
    chapo: {
      fr: "Troubles de l'érection et éjaculation précoce : des traitements documentés, délivrés uniquement après évaluation médicale.",
      en: "Erectile dysfunction and premature ejaculation: well-documented treatments, dispensed only after a medical evaluation.",
    },
    image: soinSexual,
    indications: [
      {
        fr: "Difficultés d'érection occasionnelles ou installées",
        en: "Occasional or persistent difficulty achieving an erection",
      },
      { fr: "Éjaculation précoce", en: "Premature ejaculation" },
      {
        fr: "Baisse de désir associée à un facteur identifiable",
        en: "Reduced libido linked to an identifiable factor",
      },
    ],
    produits: [
      {
        id: "viagra",
        nom: { fr: "Viagra", en: "Viagra" },
        prix: { fr: "13,50 € / comprimé", en: "€13.50 / tablet" },
        molecule: { fr: "Sildénafil", en: "Sildenafil" },
        image: produitViagra,
        alt: {
          fr: "Boîte de Viagra (sildénafil 50 mg, Pfizer) et plaquette de comprimés bleus en losange, traitement de l'érection sur ordonnance",
          en: "Box of Viagra (sildenafil 50 mg, Pfizer) and blister of blue diamond-shaped tablets, prescription erectile dysfunction treatment",
        },
        forme: { fr: "Comprimé pelliculé, 25 / 50 / 100 mg", en: "Film-coated tablet, 25 / 50 / 100 mg" },
        posologie: {
          fr: "Posologie indicative : 50 mg environ 1 heure avant le rapport, maximum une prise par 24 h. Le médecin ajuste la dose selon la tolérance.",
          en: "Indicative dosage: 50 mg about 1 hour before intercourse, maximum one dose per 24 hours. The doctor adjusts the dose according to tolerance.",
        },
        precautions: {
          fr: "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
          en: "Contraindicated with nitrate derivatives. Report: heart disease, low blood pressure, vision disorders.",
        },
        modeAction: {
          fr: "Le sildénafil appartient aux inhibiteurs de la PDE5. Il facilite l'afflux sanguin dans les corps caverneux lorsqu'une stimulation sexuelle est présente. Il n'agit ni sur le désir ni sur l'anxiété.",
          en: "Sildenafil belongs to the PDE5 inhibitor class. It facilitates blood flow into the corpora cavernosa when sexual stimulation is present. It acts neither on desire nor on anxiety.",
        },
        suivi: {
          fr: "Un point est proposé après les premières prises pour évaluer l'efficacité ressentie et la tolérance. Le médecin peut ajuster la dose, changer de molécule ou demander un examen complémentaire.",
          en: "A check-in is offered after the first doses to assess perceived effectiveness and tolerance. The doctor may adjust the dose, change the molecule, or request further examination.",
        },
      },
      {
        id: "sildenafil-generique",
        nom: { fr: "Sildénafil (générique)", en: "Sildenafil (generic)" },
        prix: { fr: "4,90 € / comprimé", en: "€4.90 / tablet" },
        molecule: { fr: "Sildénafil", en: "Sildenafil" },
        image: produitSildenafil,
        alt: {
          fr: "Boîte et plaquette de comprimés de sildénafil générique, traitement de l'érection sur ordonnance",
          en: "Box and blister of generic sildenafil tablets, prescription erectile dysfunction treatment",
        },
        forme: { fr: "Comprimé pelliculé, 25 / 50 / 100 mg", en: "Film-coated tablet, 25 / 50 / 100 mg" },
        posologie: {
          fr: "Posologie indicative : même principe actif et même schéma que la spécialité de référence, environ 1 heure avant le rapport.",
          en: "Indicative dosage: same active ingredient and same regimen as the reference brand, about 1 hour before intercourse.",
        },
        precautions: {
          fr: "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
          en: "Contraindicated with nitrate derivatives. Report: heart disease, low blood pressure, vision disorders.",
        },
        modeAction: {
          fr: "Le sildénafil appartient aux inhibiteurs de la PDE5. Il facilite l'afflux sanguin dans les corps caverneux lorsqu'une stimulation sexuelle est présente. Il n'agit ni sur le désir ni sur l'anxiété.",
          en: "Sildenafil belongs to the PDE5 inhibitor class. It facilitates blood flow into the corpora cavernosa when sexual stimulation is present. It acts neither on desire nor on anxiety.",
        },
        suivi: {
          fr: "Un point est proposé après les premières prises pour évaluer l'efficacité ressentie et la tolérance. Le médecin peut ajuster la dose, changer de molécule ou demander un examen complémentaire.",
          en: "A check-in is offered after the first doses to assess perceived effectiveness and tolerance. The doctor may adjust the dose, change the molecule, or request further examination.",
        },
      },
      {
        id: "cialis",
        nom: { fr: "Cialis", en: "Cialis" },
        prix: { fr: "15,50 € / comprimé", en: "€15.50 / tablet" },
        molecule: { fr: "Tadalafil", en: "Tadalafil" },
        image: produitCialis,
        alt: {
          fr: "Boîte de Cialis (tadalafil 10 mg, Eli Lilly) et plaquette de comprimés jaunes, traitement de l'érection longue durée sur ordonnance",
          en: "Box of Cialis (tadalafil 10 mg, Eli Lilly) and blister of yellow tablets, long-acting prescription erectile dysfunction treatment",
        },
        forme: { fr: "Comprimé, 5 / 10 / 20 mg", en: "Tablet, 5 / 10 / 20 mg" },
        posologie: {
          fr: "Posologie indicative : 10 mg avant l'activité, ou 5 mg par jour en schéma continu selon la prescription. Durée d'action jusqu'à 36 h.",
          en: "Indicative dosage: 10 mg before activity, or 5 mg per day continuously as prescribed. Duration of action up to 36 hours.",
        },
        precautions: {
          fr: "Mêmes contre-indications cardiovasculaires que les autres inhibiteurs de la PDE5.",
          en: "Same cardiovascular contraindications as other PDE5 inhibitors.",
        },
        modeAction: {
          fr: "Même mécanisme que le sildénafil, avec une durée d'action prolongée pouvant aller jusqu'à 36 heures, ce qui permet un schéma quotidien à faible dose lorsque le médecin le juge pertinent.",
          en: "Same mechanism as sildenafil, with an extended duration of action of up to 36 hours, allowing a low-dose daily regimen when the doctor deems it appropriate.",
        },
        suivi: {
          fr: "Le suivi porte sur la fréquence des prises, les effets ressentis (maux de tête, douleurs dorsales) et la pertinence d'un schéma continu plutôt qu'à la demande.",
          en: "Follow-up covers dosing frequency, perceived effects (headaches, back pain), and the relevance of a continuous rather than on-demand regimen.",
        },
      },
      {
        id: "tadalafil-generique",
        nom: { fr: "Tadalafil (générique)", en: "Tadalafil (generic)" },
        prix: { fr: "5,90 € / comprimé", en: "€5.90 / tablet" },
        molecule: { fr: "Tadalafil", en: "Tadalafil" },
        image: produitTadalafil,
        alt: {
          fr: "Boîte et plaquette de comprimés de tadalafil générique, traitement de l'érection longue durée sur ordonnance",
          en: "Box and blister of generic tadalafil tablets, long-acting prescription erectile dysfunction treatment",
        },
        forme: { fr: "Comprimé, 5 / 10 / 20 mg", en: "Tablet, 5 / 10 / 20 mg" },
        posologie: {
          fr: "Posologie indicative : même principe actif et mêmes schémas que la spécialité de référence, à la demande ou en continu.",
          en: "Indicative dosage: same active ingredient and same regimens as the reference brand, on demand or continuously.",
        },
        precautions: {
          fr: "Mêmes contre-indications cardiovasculaires. Durée d'action jusqu'à 36 h.",
          en: "Same cardiovascular contraindications. Duration of action up to 36 hours.",
        },
        modeAction: {
          fr: "Même mécanisme que le sildénafil, avec une durée d'action prolongée pouvant aller jusqu'à 36 heures, ce qui permet un schéma quotidien à faible dose lorsque le médecin le juge pertinent.",
          en: "Same mechanism as sildenafil, with an extended duration of action of up to 36 hours, allowing a low-dose daily regimen when the doctor deems it appropriate.",
        },
        suivi: {
          fr: "Le suivi porte sur la fréquence des prises, les effets ressentis (maux de tête, douleurs dorsales) et la pertinence d'un schéma continu plutôt qu'à la demande.",
          en: "Follow-up covers dosing frequency, perceived effects (headaches, back pain), and the relevance of a continuous rather than on-demand regimen.",
        },
      },
    ],
    faq: [
      {
        q: {
          fr: "Ces traitements sont-ils disponibles sans ordonnance ?",
          en: "Are these treatments available without a prescription?",
        },
        r: {
          fr: "Non. Ce sont des médicaments soumis à prescription. Un médecin évalue votre dossier avant toute délivrance.",
          en: "No. These are prescription-only medicines. A doctor reviews your file before any dispensing.",
        },
      },
      {
        q: {
          fr: "Le traitement agit-il sans désir sexuel ?",
          en: "Does the treatment work without sexual desire?",
        },
        r: {
          fr: "Non. Les inhibiteurs de la PDE5 nécessitent une stimulation sexuelle pour produire leur effet.",
          en: "No. PDE5 inhibitors require sexual stimulation to produce their effect.",
        },
      },
      {
        q: {
          fr: "Puis-je le prendre avec un traitement cardiaque ?",
          en: "Can I take it with a heart medication?",
        },
        r: {
          fr: "Certains traitements cardiaques, en particulier les dérivés nitrés, sont incompatibles. Indiquez-les dans le questionnaire.",
          en: "Some cardiac medications, particularly nitrate derivatives, are incompatible. Mention them in the questionnaire.",
        },
      },
    ],
  },
  {
    slug: "poids",
    key: "weight",
    tag: "Weight Management",
    titre: { fr: "Gestion du poids", en: "Weight management" },
    chapo: {
      fr: "Un accompagnement médical du surpoids, avec traitement prescrit uniquement lorsqu'il est justifié par votre bilan.",
      en: "Medical support for overweight, with treatment prescribed only when justified by your assessment.",
    },
    image: soinWeight,
    indications: [
      { fr: "IMC ≥ 30, ou ≥ 27 avec une comorbidité", en: "BMI ≥ 30, or ≥ 27 with a comorbidity" },
      {
        fr: "Échec des mesures hygiéno-diététiques seules",
        en: "Failure of lifestyle and dietary measures alone",
      },
      {
        fr: "Suivi régulier accepté par le patient",
        en: "Regular follow-up accepted by the patient",
      },
    ],
    produits: [
      {
        id: "wegovy",
        nom: { fr: "Wegovy", en: "Wegovy" },
        prixUnite: 279,
        prixMensuel: 249,
        prix: { fr: "249 € / mois", en: "€249 / month" },
        molecule: {
          fr: "Sémaglutide (indication perte de poids)",
          en: "Semaglutide (weight-loss indication)",
        },
        image: produitWegovy,
        alt: {
          fr: "Stylo injecteur Wegovy (sémaglutide) et sa boîte, traitement hebdomadaire du surpoids sur ordonnance",
          en: "Wegovy injector pen (semaglutide) and box, weekly prescription treatment for overweight",
        },
        forme: {
          fr: "Stylo injectable sous-cutané, une injection par semaine",
          en: "Subcutaneous injectable pen, one injection per week",
        },
        posologie: {
          fr: "Posologie indicative : montée progressive sur plusieurs semaines (0,25 mg puis paliers), une injection hebdomadaire, dose ajustée par le médecin selon la tolérance digestive.",
          en: "Indicative dosage: gradual increase over several weeks (0.25 mg then step-ups), one weekly injection, dose adjusted by the doctor according to digestive tolerance.",
        },
        precautions: {
          fr: "Non prescrit en cas d'antécédent de cancer médullaire de la thyroïde, de NEM2 ou de pancréatite. Nausées fréquentes en début de traitement.",
          en: "Not prescribed in case of a history of medullary thyroid cancer, MEN2, or pancreatitis. Nausea is common at the start of treatment.",
        },
        modeAction: {
          fr: "Le sémaglutide imite l'hormone GLP-1 : il ralentit la vidange gastrique et augmente la sensation de satiété, ce qui réduit les apports alimentaires spontanés.",
          en: "Semaglutide mimics the GLP-1 hormone: it slows gastric emptying and increases the feeling of satiety, which reduces spontaneous food intake.",
        },
        suivi: {
          fr: "Suivi rapproché indispensable : poids, tolérance digestive et paliers de dose sont revus régulièrement. Le renouvellement dépend de ces éléments.",
          en: "Close follow-up is essential: weight, digestive tolerance, and dose steps are reviewed regularly. Renewal depends on these elements.",
        },
      },
      {
        id: "ozempic",
        nom: { fr: "Ozempic", en: "Ozempic" },
        prixUnite: 149,
        prixMensuel: 129,
        prix: { fr: "129 € / mois", en: "€129 / month" },
        molecule: {
          fr: "Sémaglutide (indication diabète de type 2)",
          en: "Semaglutide (type 2 diabetes indication)",
        },
        image: produitOzempic,
        alt: {
          fr: "Stylo injecteur Ozempic (sémaglutide) et sa boîte, traitement hebdomadaire du diabète de type 2 sur ordonnance",
          en: "Ozempic injector pen (semaglutide) and box, weekly prescription treatment for type 2 diabetes",
        },
        forme: {
          fr: "Stylo injectable sous-cutané, une injection par semaine",
          en: "Subcutaneous injectable pen, one injection per week",
        },
        posologie: {
          fr: "Posologie indicative : 0,25 mg par semaine pendant 4 semaines, puis augmentation progressive selon la décision du médecin.",
          en: "Indicative dosage: 0.25 mg per week for 4 weeks, then a gradual increase as decided by the doctor.",
        },
        precautions: {
          fr: "Prescrit dans le cadre du diabète de type 2. Mêmes contre-indications thyroïdiennes et pancréatiques. Signaler tout traitement antidiabétique en cours.",
          en: "Prescribed for type 2 diabetes. Same thyroid and pancreatic contraindications. Report any ongoing antidiabetic treatment.",
        },
        modeAction: {
          fr: "Dans le diabète de type 2, le sémaglutide stimule la sécrétion d'insuline en réponse aux repas et diminue la production hépatique de glucose.",
          en: "In type 2 diabetes, semaglutide stimulates insulin secretion in response to meals and decreases hepatic glucose production.",
        },
        suivi: {
          fr: "Le suivi intègre la glycémie, les traitements antidiabétiques associés et la tolérance digestive. Toute hypoglycémie doit être signalée.",
          en: "Follow-up includes blood glucose, associated antidiabetic treatments, and digestive tolerance. Any hypoglycemia must be reported.",
        },
      },
    ],
    faq: [
      {
        q: {
          fr: "Puis-je obtenir un traitement pour perdre quelques kilos ?",
          en: "Can I get a treatment to lose a few pounds?",
        },
        r: {
          fr: "Non. Ces médicaments répondent à des critères médicaux précis. En dehors de ces critères, le médecin refuse la demande.",
          en: "No. These medicines meet precise medical criteria. Outside these criteria, the doctor declines the request.",
        },
      },
      {
        q: { fr: "Le suivi est-il obligatoire ?", en: "Is follow-up mandatory?" },
        r: {
          fr: "Oui. Le renouvellement dépend de l'évolution du poids, de la tolérance et des paramètres transmis lors du suivi.",
          en: "Yes. Renewal depends on weight progress, tolerance, and the parameters provided during follow-up.",
        },
      },
      {
        q: {
          fr: "Le traitement remplace-t-il l'alimentation et l'activité physique ?",
          en: "Does the treatment replace diet and physical activity?",
        },
        r: {
          fr: "Non. Il s'ajoute à une modification durable des habitudes, sans laquelle les résultats ne se maintiennent pas.",
          en: "No. It complements a lasting change in habits, without which results are not maintained.",
        },
      },
    ],
  },
  {
    slug: "cheveux",
    key: "hair",
    tag: "Hair Management",
    titre: { fr: "Chute de cheveux", en: "Hair loss" },
    chapo: {
      fr: "Alopécie androgénétique : freiner la chute demande un traitement continu, prescrit après évaluation.",
      en: "Androgenetic alopecia: slowing hair loss requires ongoing treatment, prescribed after evaluation.",
    },
    image: soinHair,
    indications: [
      {
        fr: "Golfes temporaux et vertex qui se dégarnissent",
        en: "Receding temples and thinning crown",
      },
      { fr: "Chute progressive depuis plusieurs mois", en: "Progressive hair loss for several months" },
      {
        fr: "Absence de cause dermatologique nécessitant un examen clinique",
        en: "No dermatological cause requiring a clinical examination",
      },
    ],
    produits: [
      {
        id: "finasteride",
        nom: { fr: "Finastéride", en: "Finasteride" },
        prixUnite: 29,
        prixMensuel: 24,
        prix: { fr: "24 € / mois", en: "€24 / month" },
        molecule: { fr: "Finastéride", en: "Finasteride" },
        image: produitFinasteride,
        alt: {
          fr: "Boîte et plaquette de comprimés de finastéride 1 mg, traitement quotidien de la chute de cheveux sur ordonnance",
          en: "Box and blister of finasteride 1 mg tablets, daily prescription treatment for hair loss",
        },
        forme: { fr: "Comprimé 1 mg", en: "1 mg tablet" },
        posologie: {
          fr: "Posologie indicative : un comprimé par jour, en continu. Les premiers effets s'évaluent après 3 à 6 mois.",
          en: "Indicative dosage: one tablet per day, continuously. First effects are assessed after 3 to 6 months.",
        },
        precautions: {
          fr: "Effets sexuels possibles, généralement réversibles à l'arrêt. Contre-indiqué chez la femme enceinte ; ne pas manipuler les comprimés cassés.",
          en: "Possible sexual side effects, generally reversible on discontinuation. Contraindicated in pregnant women; do not handle broken tablets.",
        },
        modeAction: {
          fr: "Le finastéride bloque la conversion de la testostérone en DHT, l'hormone impliquée dans la miniaturisation du follicule pileux dans l'alopécie androgénétique.",
          en: "Finasteride blocks the conversion of testosterone into DHT, the hormone involved in hair follicle miniaturization in androgenetic alopecia.",
        },
        suivi: {
          fr: "Une évaluation à 3 puis 6 mois permet de juger de la stabilisation. Tout effet sexuel ou changement d'humeur doit être signalé au médecin.",
          en: "An evaluation at 3 and then 6 months helps assess stabilization. Any sexual effect or mood change should be reported to the doctor.",
        },
      },
      {
        id: "minoxidil",
        nom: { fr: "Minoxidil", en: "Minoxidil" },
        prixUnite: 24,
        prixMensuel: 19,
        prix: { fr: "19 € / mois", en: "€19 / month" },
        molecule: { fr: "Minoxidil 5 %", en: "Minoxidil 5%" },
        image: produitMinoxidil,
        alt: {
          fr: "Flacon applicateur de solution capillaire au minoxidil 5 %, application locale matin et soir",
          en: "Applicator bottle of 5% minoxidil scalp solution, topical application morning and evening",
        },
        forme: { fr: "Solution ou mousse à application locale", en: "Topical solution or foam" },
        posologie: {
          fr: "Posologie indicative : application matin et soir sur cuir chevelu sec, sur les zones concernées.",
          en: "Indicative dosage: apply morning and evening on dry scalp, on the affected areas.",
        },
        precautions: {
          fr: "Irritation locale possible. Une chute transitoire peut survenir les premières semaines.",
          en: "Local irritation is possible. Temporary shedding may occur in the first few weeks.",
        },
        modeAction: {
          fr: "Le minoxidil topique agit localement en prolongeant la phase de croissance du cheveu et en améliorant la microcirculation du cuir chevelu.",
          en: "Topical minoxidil acts locally by prolonging the hair growth phase and improving scalp microcirculation.",
        },
        suivi: {
          fr: "Une chute transitoire dans les premières semaines est fréquente. Le suivi vérifie l'observance, l'irritation locale et l'évolution des zones traitées.",
          en: "Temporary shedding in the first few weeks is common. Follow-up checks adherence, local irritation, and progress in treated areas.",
        },
      },
    ],
    faq: [
      {
        q: { fr: "Les cheveux repoussent-ils ?", en: "Does hair grow back?" },
        r: {
          fr: "Le traitement freine surtout la chute. Une repousse partielle est possible sur les zones encore actives, pas sur les zones glabres anciennes.",
          en: "The treatment mainly slows shedding. Partial regrowth is possible in still-active areas, not on long-established bald patches.",
        },
      },
      {
        q: { fr: "Que se passe-t-il si j'arrête ?", en: "What happens if I stop?" },
        r: {
          fr: "L'évolution naturelle reprend en quelques mois. Le bénéfice est conditionné à la continuité du traitement.",
          en: "The natural progression resumes within a few months. The benefit depends on continuing the treatment.",
        },
      },
      {
        q: { fr: "Peut-on associer les deux traitements ?", en: "Can both treatments be combined?" },
        r: {
          fr: "Oui, l'association est fréquente. C'est le médecin qui décide selon votre profil.",
          en: "Yes, combining them is common. The doctor decides based on your profile.",
        },
      },
    ],
  },
  {
    slug: "peau",
    key: "skin",
    tag: "Skin Management",
    titre: { fr: "Peau", en: "Skin" },
    chapo: {
      fr: "Acné, rosacée, marques persistantes : des traitements dermatologiques prescrits après analyse de votre situation.",
      en: "Acne, rosacea, persistent marks: dermatological treatments prescribed after review of your situation.",
    },
    image: soinSkin,
    indications: [
      {
        fr: "Acné inflammatoire persistante malgré les soins en vente libre",
        en: "Persistent inflammatory acne despite over-the-counter care",
      },
      { fr: "Rosacée avec rougeurs et papules", en: "Rosacea with redness and papules" },
      { fr: "Hyperpigmentation post-inflammatoire", en: "Post-inflammatory hyperpigmentation" },
    ],
    produits: [
      {
        id: "retinoide-topique",
        nom: { fr: "Rétinoïde topique", en: "Topical retinoid" },
        prixUnite: 27,
        prixMensuel: 22,
        prix: { fr: "22 € / mois", en: "€22 / month" },
        molecule: { fr: "Trétinoïne", en: "Tretinoin" },
        image: produitTretinoine,
        alt: {
          fr: "Tube de crème à la trétinoïne, rétinoïde topique appliqué le soir sur ordonnance",
          en: "Tube of tretinoin cream, topical retinoid applied at night on prescription",
        },
        forme: { fr: "Crème 0,025 % à 0,05 %", en: "Cream 0.025% to 0.05%" },
        posologie: {
          fr: "Posologie indicative : une application le soir, sur peau sèche, en commençant un soir sur deux pendant deux semaines.",
          en: "Indicative dosage: one application at night on dry skin, starting every other night for two weeks.",
        },
        precautions: {
          fr: "Photosensibilisation : protection solaire indispensable. Irritation et desquamation fréquentes au début.",
          en: "Photosensitivity: sun protection is essential. Irritation and peeling are common at first.",
        },
        modeAction: {
          fr: "Rétinoïde topique : il accélère le renouvellement cellulaire, désobstrue les pores et améliore progressivement la texture et les marques post-inflammatoires.",
          en: "Topical retinoid: it speeds up cell renewal, unclogs pores, and gradually improves texture and post-inflammatory marks.",
        },
        suivi: {
          fr: "Le suivi porte sur l'irritation, la fréquence d'application et la protection solaire. La montée en fréquence se fait progressivement.",
          en: "Follow-up covers irritation, application frequency, and sun protection. Frequency is increased gradually.",
        },
      },
      {
        id: "metronidazole",
        nom: { fr: "Antibiotique topique de la rosacée", en: "Topical rosacea antibiotic" },
        prixUnite: 22,
        prixMensuel: 18,
        prix: { fr: "18 € / mois", en: "€18 / month" },
        molecule: { fr: "Métronidazole 0,75 %", en: "Metronidazole 0.75%" },
        image: produitMetronidazole,
        alt: {
          fr: "Tube de gel au métronidazole 0,75 %, traitement local de la rosacée sur ordonnance",
          en: "Tube of 0.75% metronidazole gel, topical prescription treatment for rosacea",
        },
        forme: { fr: "Gel ou crème", en: "Gel or cream" },
        posologie: {
          fr: "Posologie indicative : une à deux applications par jour sur les zones atteintes, pendant plusieurs semaines.",
          en: "Indicative dosage: one to two applications per day on affected areas, for several weeks.",
        },
        precautions: {
          fr: "Éviter le contact avec les yeux. Signaler toute aggravation rapide des lésions.",
          en: "Avoid contact with eyes. Report any rapid worsening of lesions.",
        },
        modeAction: {
          fr: "Action anti-inflammatoire locale sur les papules et pustules de la rosacée, avec un effet sur la flore cutanée impliquée dans les poussées.",
          en: "Local anti-inflammatory action on rosacea papules and pustules, with an effect on the skin flora involved in flare-ups.",
        },
        suivi: {
          fr: "Le suivi évalue la réduction des rougeurs et des lésions après plusieurs semaines, ainsi que les facteurs déclenchants du quotidien.",
          en: "Follow-up assesses the reduction of redness and lesions after several weeks, as well as everyday triggering factors.",
        },
      },
    ],
    faq: [
      {
        q: {
          fr: "Combien de temps avant de voir un résultat ?",
          en: "How long before seeing a result?",
        },
        r: {
          fr: "Comptez 8 à 12 semaines pour juger d'un traitement dermatologique. Une aggravation transitoire au début est courante.",
          en: "Allow 8 to 12 weeks to judge a dermatological treatment. Temporary worsening at the start is common.",
        },
      },
      {
        q: {
          fr: "Puis-je utiliser mes produits habituels ?",
          en: "Can I use my usual products?",
        },
        r: {
          fr: "Simplifiez votre routine pendant l'installation du traitement et évitez les gommages ou les acides en même temps.",
          en: "Simplify your routine while the treatment settles in, and avoid scrubs or acids at the same time.",
        },
      },
      {
        q: { fr: "Une photo est-elle nécessaire ?", en: "Is a photo required?" },
        r: {
          fr: "Le médecin peut demander des photos ou vous orienter vers un examen clinique si le diagnostic ne peut pas être posé à distance.",
          en: "The doctor may request photos or refer you for a clinical examination if the diagnosis cannot be made remotely.",
        },
      },
    ],
  },
];

/** Convertit une donnée de domaine bilingue en version localisée pour l'affichage. */
function localiseDomaine(d: DomaineData, lang: Lang): Domaine {
  return {
    slug: d.slug,
    key: d.key,
    tag: d.tag,
    titre: loc(d.titre, lang),
    chapo: loc(d.chapo, lang),
    image: d.image,
    indications: d.indications.map((i) => loc(i, lang)),
    produits: d.produits.map((p) => localiseProduit(p, lang)),
    faq: d.faq.map((f) => ({ q: loc(f.q, lang), r: loc(f.r, lang) })),
  };
}

function localiseProduit(p: ProduitData, lang: Lang): Produit {
  return {
    id: p.id,
    nom: loc(p.nom, lang),
    molecule: loc(p.molecule, lang),
    image: p.image,
    alt: loc(p.alt, lang),
    prix: loc(p.prix, lang),
    ...(p.prixUnite != null ? { prixUnite: p.prixUnite } : {}),
    ...(p.prixMensuel != null ? { prixMensuel: p.prixMensuel } : {}),
    forme: loc(p.forme, lang),
    posologie: loc(p.posologie, lang),
    precautions: loc(p.precautions, lang),
    modeAction: loc(p.modeAction, lang),
    suivi: loc(p.suivi, lang),
  };
}

/** Renvoie la liste des domaines, traduite dans la langue demandée. */
export function getSoins(lang: Lang): Domaine[] {
  return domainesData.map((d) => localiseDomaine(d, lang));
}

/** Version française par défaut, conservée pour les usages qui n'ont pas encore accès à la langue courante. */
export const domaines: Domaine[] = getSoins("fr");

export function getDomaine(slug: string, lang: Lang = "fr") {
  return getSoins(lang).find((d) => d.slug === slug);
}

/** Remises indicatives appliquées selon la durée d'abonnement (1 à 6 mois). */
export const remisesAbonnement: Record<number, number> = {
  1: 0,
  2: 0.03,
  3: 0.05,
  4: 0.08,
  5: 0.1,
  6: 0.15,
};

export function prixAbonnement(prixMensuel: number, mois: number) {
  const remise = remisesAbonnement[mois] ?? 0;
  const mensuel = prixMensuel * (1 - remise);
  return { mensuel, total: mensuel * mois, remise };
}
