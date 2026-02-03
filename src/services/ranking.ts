import { prisma } from "../libs/prisma";
export const fetchRanking = async () => {
  const getRanking = await prisma.match.groupBy({
    by: ["winnerId"],
    _count: {
      winnerId: true,
    },
    where: {
      winnerId: {
        not: null,
      },
    },
    orderBy: {
      _count: {
        winnerId: "desc",
      },
    },
  });

  const userIds = getRanking.map((item) => item.winnerId as number);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return getRanking.map((item) => {
    const user = users.find((u) => u.id === item.winnerId);
    return {
      name: user?.name || "Desconhecido",
      wins: item._count.winnerId || "Sem Dados",
      id: user?.id,
    };
  });
};
