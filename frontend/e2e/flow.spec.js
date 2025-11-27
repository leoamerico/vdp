import { test, expect } from '@playwright/test';

test('VDP Critical Flow', async ({ page }) => {
    // 1. Visit Dashboard
    await page.goto('/');
    await expect(page).toHaveTitle(/VDP/);

    // 2. Check for main cards
    await expect(page.getByText('Prazo Projetado')).toBeVisible();
    await expect(page.getByText('Consistência Semanal')).toBeVisible();

    // 3. Navigate to Simulados
    // Assuming there is a nav link or we go directly
    await page.goto('/simulados');
    await expect(page.getByText('Evolução de Acertos')).toBeVisible();

    // 4. Navigate to Skills
    await page.goto('/skills');
    await expect(page.getByText('Progresso por Skill')).toBeVisible();

    // 5. Navigate to Config
    await page.goto('/config');
    await expect(page.getByText('Configurações')).toBeVisible();
});
