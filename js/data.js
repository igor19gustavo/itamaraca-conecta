const touristSpots = [
    {
        id: 1,
        name: "Forte Orange",
        category: "Histórico",
        description: "Fortificação histórica localizada à beira-mar, conhecida por sua importância na história colonial de Pernambuco e pela paisagem formada pelo forte, pela praia e pelo Canal de Santa Cruz.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "🏰",
        image: "assets/images/forte-orange.jpg",
        coordinates: [-7.8135, -34.8405],

        details: {
            bestTime: "Durante o dia, preferencialmente em períodos de menor incidência de chuva.",
            cost: "A verificar",
            accessibility: "A confirmar. Algumas áreas históricas podem apresentar piso irregular.",
            parking: "A verificar",
            bathrooms: "A verificar",
            howToGetThere: "O Forte Orange fica na região sul da Ilha de Itamaracá, próximo à praia e ao Canal de Santa Cruz. O acesso pode ser feito pelas vias principais da ilha, seguindo as indicações para o Forte Orange.",
            history:  "A construção do Forte Orange foi iniciada em 1631 durante o período de domínio holandês. A fortificação fazia parte das estruturas militares utilizadas para proteger e controlar a região. Posteriormente, passou ao domínio português e tornou-se um dos principais símbolos históricos da Ilha de Itamaracá.",
        }
    },

    {
        id: 2,
        name: "Lagoa Azul",
        category: "Natureza",
        description: "Área natural conhecida pela paisagem verde, pelo ambiente tranquilo e pelo contato com a natureza, sendo uma opção para contemplação e lazer na Ilha de Itamaracá.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "🌊",
        image: "assets/images/lagoa-azul.jpg",
        coordinates: [-7.7350, -34.8380],

        details: {
            bestTime: "Durante o dia, preferencialmente em períodos de tempo seco",
            cost: "A verificar",
            accessibility: "A confirmar. O acesso pode apresentar trechos naturais ou irregulares.",
            parking: "A verificar",
            bathrooms: "A verificar",
            howToGetThere: "O acesso deve ser realizado pelas vias locais da Ilha de Itamaracá. Recomenda-se confirmar a rota e as condições de acesso antes da visita.",
            history: "A Lagoa Azul faz parte dos ambientes naturais associados à Ilha de Itamaracá. O local representa a diversidade de paisagens naturais da ilha e pode ser utilizado para atividades de contemplação e contato com a natureza.",
        }

        
    },

    {
        id: 3,
        name: "Coroa do Avião",
        category: "Praia",
        description: "Pequena formação insular situada na região do Canal de Santa Cruz, conhecida pelas paisagens costeiras, pelas águas rasas em determinados períodos e pelos passeios de barco.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "🏝️",
        image: "assets/images/coroa-do-aviao.jpg",
        coordinates: [-7.7500, -34.8280],

        details: {
            bestTime: "Durante o dia, observando as condições da maré e do tempo.",
            cost: "Pode haver cobrança pelo transporte de barco. Confirmar valores com os operadores locais.",
            accessibility: "A confirmar. O acesso depende do transporte por embarcação e das condições de desembarque.",
            parking: "A confirmar no ponto de embarque.",
            bathrooms: "A verificar",
            howToGetThere: "O acesso geralmente é realizado por embarcação a partir de pontos de saída na região costeira da Ilha de Itamaracá. É necessário confirmar o local de embarque, os horários e os valores com os operadores locais.",
            history: "A Coroa do Avião faz parte do conjunto de ambientes costeiros associados à Ilha de Itamaracá e ao Canal de Santa Cruz. O local é utilizado para atividades de lazer, contemplação da paisagem e passeios náuticos.",
        }
    },

    {
        id: 4,
        name: "Trilha dos Holandeses",
        category: "Trilha",
        description: "Percurso que conecta áreas históricas e naturais da Ilha de Itamaracá, passando por Vila Velha, trechos de vegetação e referências ligadas ao período colonial.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "🌿",
        image: "assets/images/trilha-dos-holandeses.jpg",
        coordinates: [-7.7600, -34.8400],

        details: {
            bestTime: "Durante o dia, preferencialmente em períodos de tempo seco.",
            cost: "A verificar",
            accessibility: "Pode apresentar trechos de mata, solo irregular e obstáculos naturais. Confirmar as condições atuais antes da visita.",
            parking: "A confirmar nos pontos de início ou término do percurso.",
            bathrooms: "A verificar",
            howToGetThere: "O percurso pode ser acessado pela região de Vila Velha ou pela área próxima ao Forte Orange. Recomenda-se confirmar o ponto de início, as condições da trilha e a necessidade de acompanhamento local antes da visita..",
            history: "A trilha está relacionada ao antigo caminho entre Vila Velha e a região do Forte Orange. Ao longo do percurso, podem ser encontrados elementos históricos, ruínas, pontes e paisagens naturais que ajudam a compreender a história da ocupação da ilha.",
        }
    },

    {
        id: 5,
        name: "Forno de Cal",
        category: "Histórico",
        description: "Estrutura histórica associada à produção tradicional de cal e ao patrimônio cultural de Vila Velha, representando parte das antigas atividades econômicas da Ilha de Itamaracá.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "🏛️",
        image: "assets/images/forno-de-cal.jpg",
        coordinates: [-7.7450, -34.8400],

        details: {
            bestTime: "Durante o dia",
            cost: "A verificar",
            accessibility: "A confirmar. A área pode apresentar estruturas antigas e piso irregular.",
            parking: "A verificar",
            bathrooms: "A verificar",
            howToGetThere: "O Forno de Cal está associado à região histórica de Vila Velha. O acesso deve ser realizado pelas vias locais, sendo recomendável confirmar a localização exata e as condições de visitação antes de ir.",
            history: "Os fornos de cal, também conhecidos como caieiras, fazem parte do conjunto de estruturas históricas de Vila Velha. Esses elementos estão relacionados à produção de cal e à ocupação histórica da região. Algumas estruturas passaram por ações de cuidado e preservação realizadas por moradores.",
        }
    },

    {
        id: 6,
        name: "Pilar",
        category: "Cultural",
        description: "Centro administrativo e cultural da Ilha de Itamaracá, conhecido pela Igreja de Nossa Senhora do Pilar, pela praça central e pela relação com as tradições religiosas e comunitárias da ilha.",
        location: "Itamaracá, PE",
        rating: 5,
        icon: "⛪",
        image: "assets/images/pilar.jpg",
        coordinates: [-7.7470, -34.8450],

        details: {
            bestTime: "Durante o dia. Em períodos de festas tradicionais, pode haver programação cultural e religiosa.",
            cost: "A verificar",
            accessibility: "A verificar",
            parking: "A verificar",
            bathrooms: "A verificar",
            howToGetThere: "O Pilar está localizado na região central da Ilha de Itamaracá. O acesso pode ser feito pelas vias principais da ilha, utilizando transporte particular, táxi ou transporte local.",
            history: "O povoado do Pilar se desenvolveu ao redor de uma capela dedicada a Nossa Senhora do Pilar. Em 1831, o povoado foi elevado à categoria de vila e, posteriormente, tornou-se a sede administrativa do município. A Igreja de Nossa Senhora do Pilar também está associada às festividades tradicionais da padroeira.",
        }
    }
];

const communityPosts = [
    {
        id: 1,
        user: "Visitante",
        touristSpot: "Forte Orange",
        description: "Um lugar incrível para conhecer a história de Itamaracá!",
        image: "assets/images/forte-orange.jpg",
        rating: 5,
        likes: 12,
        date: "Hoje"
    },

    {
        id: 2,
        user: "Morador da Ilha",
        touristSpot: "Lagoa Azul",
        description: "Uma experiência muito bonita em contato com a natureza.",
        image: "assets/images/lagoa-azul.jpg",
        rating: 5,
        likes: 8,
        date: "Ontem"
    }
];