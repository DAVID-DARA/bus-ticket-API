import { prisma } from '../prisma/prisma'; // Adjust the import based on your project structure
import { AuditLog } from '@prisma/client'; // Import the AuditLog type if using TypeScript

export const logAction = async (userId: string, action: string): Promise<AuditLog> => {
  try {
    const logEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
      },
    });
    return logEntry;
  } catch (error) {
    console.error('Error logging action:', error);
    throw new Error('Failed to log action');
  }
};
