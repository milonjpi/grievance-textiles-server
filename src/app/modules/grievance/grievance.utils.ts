import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.grievance.findFirst({
    orderBy: {
      tokenNo: 'desc',
    },
    select: {
      tokenNo: true,
    },
  });

  const splitCurrent = currentId?.tokenNo?.split('#') || ['', '0'];

  return splitCurrent[1];
};

// generate token no
export const generateTokenNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return 'T#' + incrementId?.toString().padStart(6, '00000');
};
