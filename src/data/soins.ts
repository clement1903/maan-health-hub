import soinSexual from "@/assets/soin-sexual.jpg";
import soinWeight from "@/assets/soin-weight.jpg";
import soinHair from "@/assets/soin-hair.jpg";
import soinSkin from "@/assets/soin-skin.jpg";

export type Produit = {
  nom: string;
  molecule: string;
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
        forme: "Comprimé pelliculé, 25 / 50 / 100 mg",
        posologie:
          "Posologie indicative : 50 mg environ 1 heure avant le rapport, maximum une prise par 24 h. Le médecin ajuste la dose selon la tolérance.",
        precautions:
          "Contre-indiqué avec les dérivés nitrés. À signaler : maladie cardiaque, hypotension, troubles de la vision.",
      },
      {
        nom: "Inhibiteur de la PDE5 — longue durée",
        molecule: "Tadalafil",
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
        nom: "Analogue du GLP-1 hebdomadaire",
        molecule: "Sémaglutide",
        forme: "Stylo injectable sous-cutané",
        posologie:
          "Posologie indicative : montée progressive sur plusieurs semaines, une injection par semaine, dose ajustée par le médecin selon la tolérance digestive.",
        precautions:
          "Non prescrit en cas d'antécédent de cancer médullaire de la thyroïde ou de pancréatite. Nausées fréquentes en début de traitement.",
      },
      {
        nom: "Inhibiteur des lipases",
        molecule: "Orlistat",
        forme: "Gélule 120 mg",
        posologie:
          "Posologie indicative : une gélule à chacun des trois repas principaux contenant des graisses.",
        precautions:
          "Effets digestifs fréquents. Supplémentation en vitamines liposolubles parfois nécessaire.",
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
        forme: "Comprimé 1 mg",
        posologie:
          "Posologie indicative : un comprimé par jour, en continu. Les premiers effets s'évaluent après 3 à 6 mois.",
        precautions:
          "Effets sexuels possibles, généralement réversibles à l'arrêt. Contre-indiqué chez la femme enceinte ; ne pas manipuler les comprimés cassés.",
      },
      {
        nom: "Vasodilatateur topique",
        molecule: "Minoxidil 5 %",
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
        forme: "Crème 0,025 % à 0,05 %",
        posologie:
          "Posologie indicative : une application le soir, sur peau sèche, en commençant un soir sur deux pendant deux semaines.",
        precautions:
          "Photosensibilisation : protection solaire indispensable. Irritation et desquamation fréquentes au début.",
      },
      {
        nom: "Antibiotique topique de la rosacée",
        molecule: "Métronidazole 0,75 %",
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
