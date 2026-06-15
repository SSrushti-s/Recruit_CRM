// lib/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ApplicationStatus } from '@prisma/client';

export async function createApplication(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const roleTitle = formData.get('roleTitle') as string;
  const jobUrl = formData.get('jobUrl') as string;
  const salaryRange = formData.get('salaryRange') as string;
  const status = formData.get('status') as ApplicationStatus;

  if (!companyName || !roleTitle) {
    throw new Error("Company Name and Role Title are required.");
  }

  // Insert the tracking card row directly into Supabase via Prisma
  await prisma.application.create({
    data: {
      companyName,
      roleTitle,
      jobUrl: jobUrl || null,
      salaryRange: salaryRange || null,
      status: status || 'APPLIED',
    },
  });

  // Tell Next.js to clear its cache and show the fresh data immediately
  revalidatePath('/');
}

export async function updateApplicationStatus(id: string, newStatus: ApplicationStatus) {
  if (!id || !newStatus) {
    throw new Error("Missing application ID or status");
  }

  // Update the row matching this specific ID in Supabase
  await prisma.application.update({
    where: { id },
    data: { status: newStatus },
  });

  // Refresh the UI with the updated data
  revalidatePath('/');
}

export async function getApplications() {
  return await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
  });
}