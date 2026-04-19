import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { CustomSetting } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import axios from 'axios';

// get setting
const getSetting = async (): Promise<CustomSetting | null> => {
  const result = await prisma.customSetting.findFirst();

  return result;
};

// update setting
const updateSetting = async (
  id: string,
  payload: Partial<CustomSetting>
): Promise<CustomSetting | null> => {
  // check is exist
  const isExist = await prisma.customSetting.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom Setting Not Found');
  }

  const result = await prisma.customSetting.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to Update Custom Setting'
    );
  }

  return result;
};

const getSmsBalance = async (): Promise<
  {
    PluginType: string;
    Credits: string;
  }[]
> => {
  const result = await axios.get(
    `https://sms.novocom-bd.com/api/v2/Balance?ApiKey=${process.env.API_KEY}&ClientId=${process.env.CLIENT_ID}`
  );

  return result.data?.Data;
};

export const CustomSettingService = {
  getSetting,
  updateSetting,
  getSmsBalance,
};
