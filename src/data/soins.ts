import produitSildenafil from "@/assets/produit-sildenafil.jpg";
import produitTadalafil from "@/assets/produit-tadalafil.jpg";
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

export type Produit = {
  nom: string;
  molecule: string;
  image: string;
  alt: string;
  forme: string;
  posologie: string;
  precautions: string;
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

export const domaines: Domaine[] = [
  {
    slug: "sexuel",
    key: "sexual",
    tag: "Sexual Management",
    titre: "Santé sexuelle",
    chapo:
      "Troubles de l'érection et éjaculation précoce : des traitements documentés, délivrés uniquement après évaluation médicale.",
    image: soinSexual,
    indications: [
      "Difficultés d'érection occasionnelles ou installées",
      "Éjaculation précoce",
      "Baisse de désir associée à un facteur identifiable",
    ],
    produits: [
      {
        nom: "Inhibiteur de la PDE5 — courte durée",
        molecule: "Sildénafil",
        image: produitSildenafil,
        alt: "Comprimés de sildénafil sous blister, packaging neutre",
        forme: "Comprimé pelliculé, 25 / 50 / 100 mg",
        posologie:
          "Posologie indicative : 50 mg environ 1 heure avant le rapport, maximum une prise par 24 h. Le médecin ajuste la dose selon la tolérance.",
        precautions:
          "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
      },
      {
        nom: "Inhibiteur de la PDE5 — longue durée",
        molecule: "Tadalafil",
        image: produitTadalafil,
        alt: "Comprimés de tadalafil sous blister, packaging neutre",
        forme: "Comprimé, 5 / 10 / 20 mg",
        posologie:
          "Posologie indicative : 10 mg avant l'activité, ou 5 mg par jour en schéma continu selon la prescription.",
        precautions:
          "Mêmes contre-indications cardiovasculaires. Durée d'action jusqu'à 36 h.",
      },
    ],
    faq: [
      {
        q: "Ces traitements sont-ils disponibles sans ordonnance ?",
        r: "Non. Ce sont des médicaments soumis à prescription. Un médecin évalue votre dossier avant toute délivrance.",
      },
      {
        q: "Le traitement agit-il sans désir sexuel ?",
        r: "Non. Les inhibiteurs de la PDE5 nécessitent une stimulation sexuelle pour produire leur effet.",
      },
      {
        q: "Puis-je le prendre avec un traitement cardiaque ?",
        r: "Certains traitements cardiaques, en particulier les dérivés nitrés, sont incompatibles. Indiquez-les dans le questionnaire.",
      },
    ],
  },
  {
    slug: "poids",
    key: "weight",
    tag: "Weight Management",
    titre: "Gestion du poids",
    chapo:
      "Un accompagnement médical du surpoids, avec traitement prescrit uniquement lorsqu'il est justifié par votre bilan.",
    image: soinWeight,
    indications: [
      "IMC ≥ 30, ou ≥ 27 avec une comorbidité",
      "Échec des mesures hygiéno-diététiques seules",
      "Suivi régulier accepté par le patient",
    ],
    produits: [
      {
        nom: "Wegovy",
        molecule: "Sémaglutide (indication perte de poids)",
        image: produitWegovy,
        alt: "Stylo injecteur de sémaglutide Wegovy posé à côté de sa boîte",
        forme: "Stylo injectable sous-cutané, une injection par semaine",
        posologie:
          "Posologie indicative : montée progressive sur plusieurs semaines (0,25 mg puis paliers), une injection hebdomadaire, dose ajustée par le médecin selon la tolérance digestive.",
        precautions:
          "Non prescrit en cas d'antécédent de cancer médullaire de la thyroïde, de NEM2 ou de pancréatite. Nausées fréquentes en début de traitement.",
      },
      {
        nom: "Ozempic",
        molecule: "Sémaglutide (indication diabète de type 2)",
        image: produitOzempic,
        alt: "Stylo injecteur de sémaglutide Ozempic sur un tissu beige",
        forme: "Stylo injectable sous-cutané, une injection par semaine",
        posologie:
          "Posologie indicative : 0,25 mg par semaine pendant 4 semaines, puis augmentation progressive selon la décision du médecin.",
        precautions:
          "Prescrit dans le cadre du diabète de type 2. Mêmes contre-indications thyroïdiennes et pancréatiques. Signaler tout traitement antidiabétique en cours.",
      },
    ],
    faq: [
      {
        q: "Puis-je obtenir un traitement pour perdre quelques kilos ?",
        r: "Non. Ces médicaments répondent à des critères médicaux précis. En dehors de ces critères, le médecin refuse la demande.",
      },
      {
        q: "Le suivi est-il obligatoire ?",
        r: "Oui. Le renouvellement dépend de l'évolution du poids, de la tolérance et des paramètres transmis lors du suivi.",
      },
      {
        q: "Le traitement remplace-t-il l'alimentation et l'activité physique ?",
        r: "Non. Il s'ajoute à une modification durable des habitudes, sans laquelle les résultats ne se maintiennent pas.",
      },
    ],
  },
  {
    slug: "cheveux",
    key: "hair",
    tag: "Hair Management",
    titre: "Chute de cheveux",
    chapo:
      "Alopécie androgénétique : freiner la chute demande un traitement continu, prescrit après évaluation.",
    image: soinHair,
    indications: [
      "Golfes temporaux et vertex qui se dégarnissent",
      "Chute progressive depuis plusieurs mois",
      "Absence de cause dermatologique nécessitant un examen clinique",
    ],
    produits: [
      {
        nom: "Inhibiteur de la 5-alpha-réductase",
        molecule: "Finastéride",
        image: produitFinasteride,
        alt: "Comprimés de finastéride sous blister, packaging neutre",
        forme: "Comprimé 1 mg",
        posologie:
          "Posologie indicative : un comprimé par jour, en continu. Les premiers effets s'évaluent après 3 à 6 mois.",
        precautions:
          "Effets sexuels possibles, généralement réversibles à l'arrêt. Contre-indiqué chez la femme enceinte ; ne pas manipuler les comprimés cassés.",
      },
      {
        nom: "Vasodilatateur topique",
        molecule: "Minoxidil 5 %",
        image: produitMinoxidil,
        alt: "Flacon spray neutre de solution capillaire au minoxidil",
        forme: "Solution ou mousse à application locale",
        posologie:
          "Posologie indicative : application matin et soir sur cuir chevelu sec, sur les zones concernées.",
        precautions:
          "Irritation locale possible. Une chute transitoire peut survenir les premières semaines.",
      },
    ],
    faq: [
      {
        q: "Les cheveux repoussent-ils ?",
        r: "Le traitement freine surtout la chute. Une repousse partielle est possible sur les zones encore actives, pas sur les zones glabres anciennes.",
      },
      {
        q: "Que se passe-t-il si j'arrête ?",
        r: "L'évolution naturelle reprend en quelques mois. Le bénéfice est conditionné à la continuité du traitement.",
      },
      {
        q: "Peut-on associer les deux traitements ?",
        r: "Oui, l'association est fréquente. C'est le médecin qui décide selon votre profil.",
      },
    ],
  },
  {
    slug: "peau",
    key: "skin",
    tag: "Skin Management",
    titre: "Peau",
    chapo:
      "Acné, rosacée, marques persistantes : des traitements dermatologiques prescrits après analyse de votre situation.",
    image: soinSkin,
    indications: [
      "Acné inflammatoire persistante malgré les soins en vente libre",
      "Rosacée avec rougeurs et papules",
      "Hyperpigmentation post-inflammatoire",
    ],
    produits: [
      {
        nom: "Rétinoïde topique",
        molecule: "Trétinoïne",
        image: produitTretinoine,
        alt: "Tube de crème neutre à la trétinoïne",
        forme: "Crème 0,025 % à 0,05 %",
        posologie:
          "Posologie indicative : une application le soir, sur peau sèche, en commençant un soir sur deux pendant deux semaines.",
        precautions:
          "Photosensibilisation : protection solaire indispensable. Irritation et desquamation fréquentes au début.",
      },
      {
        nom: "Antibiotique topique de la rosacée",
        molecule: "Métronidazole 0,75 %",
        image: produitMetronidazole,
        alt: "Tube de gel neutre au métronidazole",
        forme: "Gel ou crème",
        posologie:
          "Posologie indicative : une à deux applications par jour sur les zones atteintes, pendant plusieurs semaines.",
        precautions:
          "Éviter le contact avec les yeux. Signaler toute aggravation rapide des lésions.",
      },
    ],
    faq: [
      {
        q: "Combien de temps avant de voir un résultat ?",
        r: "Comptez 8 à 12 semaines pour juger d'un traitement dermatologique. Une aggravation transitoire au début est courante.",
      },
      {
        q: "Puis-je utiliser mes produits habituels ?",
        r: "Simplifiez votre routine pendant l'installation du traitement et évitez les gommages ou les acides en même temps.",
      },
      {
        q: "Une photo est-elle nécessaire ?",
        r: "Le médecin peut demander des photos ou vous orienter vers un examen clinique si le diagnostic ne peut pas être posé à distance.",
      },
    ],
  },
];

export function getDomaine(slug: string) {
  return domaines.find((d) => d.slug === slug);
}

export type Contenu = {
  intro: string;
  concerne: string[];
  chiffres: { valeur: string; label: string; source: string }[];
};

export const contenus: Record<string, Contenu> = {
  sexuel: {
    intro:
      "Les troubles de l'érection sont fréquents et rarement isolés : fatigue, stress, tabac, alcool, diabète, hypertension ou certains médicaments peuvent y contribuer. C'est un motif de consultation courant, et souvent le premier signe d'un déséquilibre plus général qu'un médecin peut explorer.",
    concerne: [
      "Hommes constatant des difficultés d'érection régulières depuis plus de trois mois",
      "Hommes présentant une éjaculation plus rapide que souhaitée, de façon répétée",
      "Hommes avec facteurs de risque cardiovasculaires ou métaboliques (tabac, diabète, surpoids)",
      "Hommes dont la vie de couple ou la confiance est affectée par la situation",
    ],
    chiffres: [
      {
        valeur: "≈ 1 sur 5",
        label: "hommes adultes concernés par des troubles de l'érection",
        source: "Estimation de prévalence issue de la littérature médicale internationale",
      },
      {
        valeur: "Augmente avec l'âge",
        label: "la fréquence progresse nettement après 40 ans",
        source: "Données épidémiologiques générales",
      },
      {
        valeur: "Souvent multifactoriel",
        label: "causes physiques et psychologiques fréquemment associées",
        source: "Consensus médical",
      },
    ],
  },
  poids: {
    intro:
      "Le surpoids n'est pas un simple manque de volonté : métabolisme, sommeil, stress, traitements et habitudes alimentaires interagissent. Un accompagnement médical permet d'objectiver la situation, de fixer des objectifs réalistes et de suivre l'évolution dans la durée.",
    concerne: [
      "Hommes dont l'IMC se situe au-dessus de la zone considérée comme normale",
      "Hommes ayant repris du poids après plusieurs tentatives de régime",
      "Hommes présentant des facteurs associés : hypertension, glycémie élevée, apnée du sommeil",
      "Hommes cherchant un cadre médical plutôt qu'une solution en libre accès",
    ],
    chiffres: [
      {
        valeur: "Majorité d'adultes",
        label: "en surpoids ou en situation d'obésité dans de nombreux pays européens",
        source: "Données de santé publique européennes",
      },
      {
        valeur: "Suivi long",
        label: "les résultats durables reposent sur un accompagnement de plusieurs mois",
        source: "Recommandations générales de prise en charge",
      },
      {
        valeur: "Risques associés",
        label: "diabète de type 2, hypertension et troubles du sommeil",
        source: "Littérature médicale",
      },
    ],
  },
  cheveux: {
    intro:
      "L'alopécie androgénétique est la cause la plus fréquente de chute de cheveux chez l'homme. Elle évolue progressivement, généralement des tempes vers le sommet du crâne. Plus la prise en charge est précoce, plus l'objectif de préserver les cheveux existants est réaliste.",
    concerne: [
      "Hommes constatant un recul des golfes temporaux ou un éclaircissement du vertex",
      "Hommes avec des antécédents familiaux de calvitie",
      "Hommes en début de chute, avec une densité encore majoritairement préservée",
      "Hommes souhaitant stabiliser l'évolution avant qu'elle ne s'installe",
    ],
    chiffres: [
      {
        valeur: "≈ 1 sur 2",
        label: "hommes touchés par une calvitie à partir de la cinquantaine",
        source: "Estimation issue de la littérature dermatologique",
      },
      {
        valeur: "Dès 20-30 ans",
        label: "les premiers signes apparaissent souvent chez l'adulte jeune",
        source: "Données dermatologiques générales",
      },
      {
        valeur: "Agir tôt",
        label: "les traitements visent surtout à ralentir la chute, pas à recréer un cheveu perdu",
        source: "Consensus médical",
      },
    ],
  },
  peau: {
    intro:
      "Acné persistante, peau grasse, rougeurs ou marques : la peau masculine, souvent plus épaisse et soumise au rasage, réagit différemment. Une routine validée médicalement évite les essais successifs de produits inadaptés.",
    concerne: [
      "Hommes avec une acné qui persiste à l'âge adulte",
      "Hommes gênés par des rougeurs, une peau grasse ou des irritations liées au rasage",
      "Hommes ayant déjà essayé plusieurs produits sans résultat stable",
      "Hommes souhaitant traiter des marques ou des taches post-inflammatoires",
    ],
    chiffres: [
      {
        valeur: "Très fréquente",
        label: "l'acné touche la grande majorité des adolescents et persiste chez de nombreux adultes",
        source: "Données dermatologiques générales",
      },
      {
        valeur: "Plusieurs semaines",
        label: "les traitements cutanés demandent en général 8 à 12 semaines avant évaluation",
        source: "Recommandations dermatologiques usuelles",
      },
      {
        valeur: "Rasage",
        label: "facteur d'irritation spécifique chez l'homme",
        source: "Littérature dermatologique",
      },
    ],
  },
};
