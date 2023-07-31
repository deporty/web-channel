export default {
  title: 'Copa Ciudad Manizales',
  abstract:
    'El mejor torneo de Manizales. Un torneo con altura, que une a los deportistas del país en un evento magnánimo anualmente.',
  publicationDate: '02-02-2022',
  author: 'Maria Fernanda Villa',
  preview: {
    image: 'assets/index/preview3.jpg',
    photographer: 'Daniela Leyton',
  },
  socialnetPreview: {
    image: 'assets/index/preview3.jpg',
    photographer: 'Daniela Leyton',
  },
  body: {
    children: [
      {
        component: 'app-paragraph',
        data: {
          text: `
                Nuestra copa se desarrolla en los mejores escenarios deportivos de la ciudad. 
                En canchas sintéticas y de césped viviremos los mejores encuentros en el mes de diciembre.
                `,
          img: 'assets/dates/01-02-2022/match.jpeg',
          'img-position': 'left',
          subtitle: '',
        },
        children: [],
      },
    ],
  },
};
