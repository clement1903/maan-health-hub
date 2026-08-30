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

export type Produit = {
  nom: string;
  molecule: string;
  image: string;
  alt: string;
  prix: string;
  /** Prix d'un achat à l'unité (une boîte / un flacon), en euros. Absent pour la santé sexuelle. */
  prixUnite?: number;
  /** Prix mensuel de base d'un abonnement, en euros. Absent pour la santé sexuelle. */
  prixMensuel?: number;
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
        nom: "Viagra",
        prix: "54 € / mois",
        molecule: "Sildénafil",
        image: produitViagra,
        alt: "Boîte de Viagra (sildénafil 50 mg, Pfizer) et plaquette de comprimés bleus en losange, traitement de l'érection sur ordonnance",
        forme: "Comprimé pelliculé, 25 / 50 / 100 mg",
        posologie:
          "Posologie indicative : 50 mg environ 1 heure avant le rapport, maximum une prise par 24 h. Le médecin ajuste la dose selon la tolérance.",
        precautions:
          "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
      },
      {
        nom: "Sildénafil (générique)",
        prix: "29 € / mois",
        molecule: "Sildénafil",
        image: produitSildenafil,
        alt: "Boîte et plaquette de comprimés de sildénafil générique, traitement de l'érection sur ordonnance",
        forme: "Comprimé pelliculé, 25 / 50 / 100 mg",
        posologie:
          "Posologie indicative : même principe actif et même schéma que la spécialité de référence, environ 1 heure avant le rapport.",
        precautions:
          "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
      },
      {
        nom: "Cialis",
        prix: "62 € / mois",
        molecule: "Tadalafil",
        image: produitCialis,
        alt: "Boîte de Cialis (tadalafil 10 mg, Eli Lilly) et plaquette de comprimés jaunes, traitement de l'érection longue durée sur ordonnance",
        forme: "Comprimé, 5 / 10 / 20 mg",
        posologie:
          "Posologie indicative : 10 mg avant l'activité, ou 5 mg par jour en schéma continu selon la prescription. Durée d'action jusqu'à 36 h.",
        precautions:
          "Mêmes contre-indications cardiovasculaires que les autres inhibiteurs de la PDE5.",
      },
      {
        nom: "Tadalafil (générique)",
        prix: "34 € / mois",
        molecule: "Tadalafil",
        image: produitTadalafil,
        alt: "Boîte et plaquette de comprimés de tadalafil générique, traitement de l'érection longue durée sur ordonnance",
        forme: "Comprimé, 5 / 10 / 20 mg",
        posologie:
          "Posologie indicative : même principe actif et mêmes schémas que la spécialité de référence, à la demande ou en continu.",
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
        prixUnite: 279,
        prixMensuel: 249,
        prix: "249 € / mois",
        molecule: "Sémaglutide (indication perte de poids)",
        image: produitWegovy,
        alt: "Stylo injecteur Wegovy (sémaglutide) et sa boîte, traitement hebdomadaire du surpoids sur ordonnance",
        forme: "Stylo injectable sous-cutané, une injection par semaine",
        posologie:
          "Posologie indicative : montée progressive sur plusieurs semaines (0,25 mg puis paliers), une injection hebdomadaire, dose ajustée par le médecin selon la tolérance digestive.",
        precautions:
          "Non prescrit en cas d'antécédent de cancer médullaire de la thyroïde, de NEM2 ou de pancréatite. Nausées fréquentes en début de traitement.",
      },
      {
        nom: "Ozempic",
        prixUnite: 149,
        prixMensuel: 129,
        prix: "129 € / mois",
        molecule: "Sémaglutide (indication diabète de type 2)",
        image: produitOzempic,
        alt: "Stylo injecteur Ozempic (sémaglutide) et sa boîte, traitement hebdomadaire du diabète de type 2 sur ordonnance",
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
        prixUnite: 29,
        prixMensuel: 24,
        prix: "24 € / mois",
        molecule: "Finastéride",
        image: produitFinasteride,
        alt: "Boîte et plaquette de comprimés de finastéride 1 mg, traitement quotidien de la chute de cheveux sur ordonnance",
        forme: "Comprimé 1 mg",
        posologie:
          "Posologie indicative : un comprimé par jour, en continu. Les premiers effets s'évaluent après 3 à 6 mois.",
        precautions:
          "Effets sexuels possibles, généralement réversibles à l'arrêt. Contre-indiqué chez la femme enceinte ; ne pas manipuler les comprimés cassés.",
      },
      {
        nom: "Vasodilatateur topique",
        prixUnite: 24,
        prixMensuel: 19,
        prix: "19 € / mois",
        molecule: "Minoxidil 5 %",
        image: produitMinoxidil,
        alt: "Flacon applicateur de solution capillaire au minoxidil 5 %, application locale matin et soir",
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
        prixUnite: 27,
        prixMensuel: 22,
        prix: "22 € / mois",
        molecule: "Trétinoïne",
        image: produitTretinoine,
        alt: "Tube de crème à la trétinoïne, rétinoïde topique appliqué le soir sur ordonnance",
        forme: "Crème 0,025 % à 0,05 %",
        posologie:
          "Posologie indicative : une application le soir, sur peau sèche, en commençant un soir sur deux pendant deux semaines.",
        precautions:
          "Photosensibilisation : protection solaire indispensable. Irritation et desquamation fréquentes au début.",
      },
      {
        nom: "Antibiotique topique de la rosacée",
        prixUnite: 22,
        prixMensuel: 18,
        prix: "18 € / mois",
        molecule: "Métronidazole 0,75 %",
        image: produitMetronidazole,
        alt: "Tube de gel au métronidazole 0,75 %, traitement local de la rosacée sur ordonnance",
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

export type ProduitDetails = {
  modeAction: string;
  suivi: string;
};

/**
 * Informations pédagogiques complémentaires, à titre indicatif.
 * Elles n'établissent aucune éligibilité : seul le médecin décide.
 */
export const produitDetails: Record<string, ProduitDetails> = {
  Sildénafil: {
    modeAction:
      "Le sildénafil appartient aux inhibiteurs de la PDE5. Il facilite l'afflux sanguin dans les corps caverneux lorsqu'une stimulation sexuelle est présente. Il n'agit ni sur le désir ni sur l'anxiété.",
    suivi:
      "Un point est proposé après les premières prises pour évaluer l'efficacité ressentie et la tolérance. Le médecin peut ajuster la dose, changer de molécule ou demander un examen complémentaire.",
  },
  Tadalafil: {
    modeAction:
      "Même mécanisme que le sildénafil, avec une durée d'action prolongée pouvant aller jusqu'à 36 heures, ce qui permet un schéma quotidien à faible dose lorsque le médecin le juge pertinent.",
    suivi:
      "Le suivi porte sur la fréquence des prises, les effets ressentis (maux de tête, douleurs dorsales) et la pertinence d'un schéma continu plutôt qu'à la demande.",
  },
  "Sémaglutide (indication perte de poids)": {
    modeAction:
      "Le sémaglutide imite l'hormone GLP-1 : il ralentit la vidange gastrique et augmente la sensation de satiété, ce qui réduit les apports alimentaires spontanés.",
    suivi:
      "Suivi rapproché indispensable : poids, tolérance digestive et paliers de dose sont revus régulièrement. Le renouvellement dépend de ces éléments.",
  },
  "Sémaglutide (indication diabète de type 2)": {
    modeAction:
      "Dans le diabète de type 2, le sémaglutide stimule la sécrétion d'insuline en réponse aux repas et diminue la production hépatique de glucose.",
    suivi:
      "Le suivi intègre la glycémie, les traitements antidiabétiques associés et la tolérance digestive. Toute hypoglycémie doit être signalée.",
  },
  Finastéride: {
    modeAction:
      "Le finastéride bloque la conversion de la testostérone en DHT, l'hormone impliquée dans la miniaturisation du follicule pileux dans l'alopécie androgénétique.",
    suivi:
      "Une évaluation à 3 puis 6 mois permet de juger de la stabilisation. Tout effet sexuel ou changement d'humeur doit être signalé au médecin.",
  },
  "Minoxidil 5 %": {
    modeAction:
      "Le minoxidil topique agit localement en prolongeant la phase de croissance du cheveu et en améliorant la microcirculation du cuir chevelu.",
    suivi:
      "Une chute transitoire dans les premières semaines est fréquente. Le suivi vérifie l'observance, l'irritation locale et l'évolution des zones traitées.",
  },
  Trétinoïne: {
    modeAction:
      "Rétinoïde topique : il accélère le renouvellement cellulaire, désobstrue les pores et améliore progressivement la texture et les marques post-inflammatoires.",
    suivi:
      "Le suivi porte sur l'irritation, la fréquence d'application et la protection solaire. La montée en fréquence se fait progressivement.",
  },
  "Métronidazole 0,75 %": {
    modeAction:
      "Action anti-inflammatoire locale sur les papules et pustules de la rosacée, avec un effet sur la flore cutanée impliquée dans les poussées.",
    suivi:
      "Le suivi évalue la réduction des rougeurs et des lésions après plusieurs semaines, ainsi que les facteurs déclenchants du quotidien.",
  },
};

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
