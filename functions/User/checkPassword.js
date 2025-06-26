import bcrypt from 'bcrypt';


export default async function(email, password) {

    const [ kojo ] = this;
    const { prisma } = kojo.state;

    const user = await prisma.User.findUnique({ where: { email }});
    return await bcrypt.compare(password, user.passwordHash);
}
