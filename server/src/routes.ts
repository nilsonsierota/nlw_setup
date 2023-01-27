import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (req) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(req.body);

    await prisma.habit.create({
      data: {
        title,
        created_at: new Date(),
        weekDays: {
          create: weekDays.map((weekDays) => {
            return {
              week_day: weekDays,
            };
          }),
        },
      },
    });
  });
}
