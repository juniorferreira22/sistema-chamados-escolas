const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar técnicos
  const technicians = [
    {
      login: 'junior',
      password: await bcrypt.hash('Junior153900', 10),
      name: 'Junior Ferreira - Administrador',
      occupation: 'Desenvolvedor de Software',
      phone: '(16) 99412-5365',
      email: 'seceducacao.junior@gmail.com',
    },
    {
      login: 'leonardonacata',
      password: await bcrypt.hash('Nacata2025@', 10),
      name: 'Leonardo Nacata - Técnico',
      occupation: 'Técnico de Informática',
      phone: '(16) 99161-5500',
      email: 'leonardo.nacata@educacao.sp.gov.br',
    },
    {
      login: 'gilsonbarbosa',
      password: await bcrypt.hash('tecnico123', 10),
      name: 'Maria Santos',
      occupation: 'Técnica de Suporte',
      phone: '(16) 99607-4589',
      email: 'gilson.barbosa@educacao.sp.gov.br',
    },
  ];

  for (const tech of technicians) {
    await prisma.user.create({
      data: {
        login: tech.login,
        password: tech.password,
        name: tech.name,
        role: 'TECHNICIAN',
        technician: {
          create: {
            occupation: tech.occupation,
            phone: tech.phone,
            email: tech.email,
          },
        },
      },
    });
    console.log(`✅ Técnico criado: ${tech.name}`);
  }

  // Criar 22 escolas
  const schools = [
    { name: 'EMEB Prof. Luiz Garavello', address: 'Jose Mazzi, 920.', district: 'Jardim Monte Alegre' },
    { name: 'EMEB Prof. Hamilton Perrone', address: 'Rafael Fabricio, 35.', district: 'Residencial Nelson Caporusso' },
    { name: 'EMEB Profª. Maria Helena Martinez', address: 'Guido Garavello, 184.', district: 'Jardim Sao Francisco' },
    { name: 'EMEB Amaral Vaz Melone', address: 'Paschoal de Laurentiz, 460.', district: 'Jd. Hortência' },
    { name: 'EMEB Gino Bellodi', address: 'Ribeirao Preto, 350.', district: 'Conjunto Habitacional Aparecida Biccio do Amaral' },
    { name: 'EMEB Profª. Mariana Nagata Chenes', address: 'Arthur Rodrigues, 109.', district: 'Jardim Monte Alegre' },
    { name: 'EMEB Profª. Maria Cecília Pacífico de Faria', address: 'Ernesto de Angelis, 605.', district: 'Conjunto Habitacional Sergio Antonio Corona' },
    { name: 'EMEB Francisco Antonio Louzada', address: 'Vicente Marafioti, 366.', district: 'Jardim Monte Belo' },
    { name: 'EMEB Profª. Lucimar Santos Cunha de Oliveira', address: 'Lais Sadalla, 80.', district: 'Residencial Laurentiz' },
    { name: 'EMEB Prof. Alfredo Rolim de Moura', address: 'Francisco Volch, 341', district: 'Vila Gomes de Azevedo' },
    { name: 'EMEB Marlene Riotto Louzada', address: 'Da Paz, 50.', district: 'Conjunto Habitacional Sergio Antonio Corona' },
    { name: 'EMEB Profª. Vilma Ragazzi Ropa', address: 'Joao Nogueira, 60.', district: 'Residencial Vila Mariana II' },
    { name: 'EMEB Profª. Izabel Sadalla Grispino', address: 'Americo Fabiano Luiz, 320.', district: 'Jardim Sao Bento' },
    { name: 'EMEB Profª. Andrea Godoi Wik Delfino', address: 'Tufic Jose Abimussi, 333.', district: 'Centro' },
    { name: 'EMEB Profª Maria da Penha Fratti', address: 'Dos Griecco, 151.', district: 'Vila Gomes de Azevedo' },
    { name: 'EMEB Sgto. Edgard Pontieri', address: 'Luiz Carlos Lonetto, 591.', district: 'Residencial Mario Cazeri' },
    { name: 'EMEB Profª Maria Dolores Gomes Peres Garavello', address: 'Augusto Rodrigues de Oliveira, 101.', district: 'Residencial Clementino Politi' },
    { name: 'EMEB Padre Adelino de Carli', address: 'Paschoal Lucizani, 21.', district: 'Residencial Vila Mariana' },
    { name: 'EMEB Pref. Paulo Mangolini', address: 'Vereador Antonio Riotto, 71.', district: 'Jardim Paulistano' },
    { name: 'EMEB Dr. Raul Bauab', address: 'Ribeirao Preto, 240.', district: 'Conjunto Habitacional Aparecida Biccio do Amaral' }
  ];

  for (let i = 0; i < schools.length; i++) {
    const school = schools[i];
    const loginNumber = String(i + 1).padStart(2, '0');
    
    await prisma.user.create({
      data: {
        login: `escola${loginNumber}`,
        password: await bcrypt.hash(`escola${loginNumber}123`, 10),
        name: school.name,
        role: 'SCHOOL',
        school: {
          create: {
            address: school.address,
            phone: `(16) 3251-${String(1000 + i).slice(1)}`,
            email: `escola${loginNumber}@educacao.guariba.sp.gov.br`,
            district: school.district,
            inep: `35${String(700000 + i)}`,
          },
        },
      },
    });
    console.log(`✅ Escola criada: ${school.name} (login: escola${loginNumber})`);
  }

  console.log('\n✨ Seed concluído com sucesso!');
  console.log('\n📝 Credenciais criadas:');
  console.log('\n🔧 TÉCNICOS:');
  console.log('   admin / admin123');
  console.log('   tecnico1 / tecnico123');
  console.log('   tecnico2 / tecnico123');
  console.log('\n🏫 ESCOLAS:');
  console.log('   escola01 / escola01123 (até escola22 / escola22123)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
