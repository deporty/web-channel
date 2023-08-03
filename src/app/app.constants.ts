export const DEFAULT_PROFILE_IMG = 'assets/default-player-profile.jpg';
export const DEFAULT_SHIELD_IMG = 'assets/badge-team.png';
export const DEFAULT_ORGANIZATION_IMG = 'assets/organizers.png';
export const DEFAULT_TOURNAMENT_LAYOUT_IMG =
  'assets/default-tournament-layout.jpg';

export const REFEREE_ROLE = 'iThJqDkoVhcnRcGGvRru';

export const BUCKET_NAME = 'deporty-app.appspot.com';

export const TOURNAMENT_STATUS_CODES = [
  {
    display: 'Borrador',
    value: 'draft',
    description:
      'Indica que el torneo está en planeación, por tanto no les aparecerá a los deportistas. Solo lo puedes ver tú como organizador.',
  },
  {
    display: 'En inscripciones',
    value: 'check-in',
    description:
      'En este estado, el torneo se encuentra debidamente estructurado y ha sido abierto para el público en general.',
  },
  {
    display: 'En curso',
    value: 'running',
    description:
      'Indica que el torneo ya pasó por la etapa de inscripciones (si la tuvo) y que está en marcha.',
  },

  {
    display: 'Finalizado',
    value: 'finished',
    description:
      'Cuando el torneo se ejecute en su totalidad, el estado será finalizado. Ya no se podrán realizar acciones de edición sobre el torneo.',
  },

  {
    display: 'Cancelado',
    value: 'canceled',
    description:
      'Si existe alguna eventualidad que impida el normal desarrollo del torneo, este es el estado que adoptará el mismo.',
  },
  {
    display: 'Eliminado',
    value: 'deleted',
    description:
      'Cuando un torneo se desea eliminar, pero ya fue publicado, es decir que entró en estado de Inscripciones o cualquier otro diferente a Borrador, en lugar de eliminarse del sistema, se configura este estado. El público no podrá verlo.',
  },
];

export const REGISTERED_TEAM_STATUS_CODES = [
  {
    display: 'Preinscrito',
    name: 'pre-registered',
    description: `Todos los equipos entran por defecto en el estado de preinscrito. Esto
    significa, que el equipo ha manifestado la intención de participar, pero no
    ha cumplido con los requisitos extras que el organizador imponga. Si por
    ejemplo, existe un torneo con una inscripción de $500.000, quien no haya
    realizado el pago, no podrá participar en el torneo, aunque se encuentre
    inscrito en el mismo. Es por eso, que todos entran en este estado por
    defecto.`,
    abstract: `Todos los equipos entran por defecto en el estado de preinscrito. Esto
    significa, que el equipo ha manifestado la intención de participar, pero no
    ha cumplido con los requisitos extras que el organizador imponga.`,
  },
  {
    display: 'Preinscrito y habilitado',
    name: 'pre-registered and enabled',
    description: `También existe la posibilidad de que aunque un equipo no cumpla con las
    condiciones de inscripción, el organizador permita dejarlos participar, ya
    que resolvieron dicha condición por aparte. En este caso, se marcaría al
    equipo con este estado, para indicar que en efecto puede concursar, pero que
    tiene asuntos pendientes con la organización.`,
    abstract: `Indica que el organizador del torneo permite al equipo participar, aunque no estén cumpliendo con los requisitos.`,
  },
  {
    display: 'Habilidato',
    name: 'enabled',
    description: `Si el equipo ha cumplido con todas y cada una de las condiciones de la
    organización, puede disfrutar del torneo sin ningún problema.`,
    abstract: `Si el equipo ha cumplido con todas y cada una de las condiciones de la
    organización, puede disfrutar del torneo sin ningún problema.`,
  },
];
export const MATCHES_STATUS_CODES = [
  {
    display: 'En edición',
    name: 'editing',
    description: ``,
    abstract: ``,
  },
  {
    display: 'Completado',
    name: 'completed',
    description: ``,
    abstract: ``,
  },
  {
    display: 'Publicado',
    name: 'published',
    description: ``,
    abstract: ``,
  },
];

export const CATEGORIES = [
  'Sub 3',
  'Sub 4',
  'Sub 5',
  'Sub 6',
  'Sub 7',
  'Sub 8',
  'Sub 9',
  'Sub 10',
  'Sub 11',
  'Sub 12',
  'Sub 13',
  'Sub 14',
  'Sub 15',
  'Sub 16',
  'Sub 17',
  'Sub 18',
  'Sub 19',
  'Sub 20',
  'Sub 21',
  'Open',
];

export const PRIMARY_COLOR = '#43efb1';
// 30c694
export const SECONDARY_COLOR = '#05386B';
export const ACCENT_COLOR = '#ffffff';
export const WARN_COLOR = '#DB314C';


export const userTokenKey = 'user-token';

export const GROUP_SIZES_PLACEHOLDERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];