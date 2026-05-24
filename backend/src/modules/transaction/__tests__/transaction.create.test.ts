/**
 * CREATE
 */
describe("createTransaction", () => {
  it("should create transaction", async () => {
    mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

    mockPrisma.transaction.create.mockResolvedValue({
      id: "tx-1",
      type: "INCOME",
      amount: new Prisma.Decimal("100"),
    } as any);

    const result = await transactionService.createTransaction("user-1", {
      type: "INCOME",
      amount: 100,
      accountId: "account-1",
    });

    expect(result.id).toBe("tx-1");
  });

  it("should reject invalid amount", async () => {
    mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

    await expect(
      transactionService.createTransaction("user-1", {
        type: "INCOME",
        amount: "abc",
        accountId: "account-1",
      })
    ).rejects.toThrow(AppError);
  });

  it("should reject invalid date", async () => {
    mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

    await expect(
      transactionService.createTransaction("user-1", {
        type: "INCOME",
        amount: 100,
        accountId: "account-1",
        date: "not-a-date",
      })
    ).rejects.toThrow(AppError);
  });

  it("should reject if account not found", async () => {
    mockPrisma.account.findFirst.mockResolvedValue(null);

    await expect(
      transactionService.createTransaction("user-1", {
        type: "INCOME",
        amount: 100,
        accountId: "non-existent",
      })
    ).rejects.toThrow(AppError);
  });

  it("should accept valid date string", async () => {
    mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

    mockPrisma.transaction.create.mockResolvedValue({
      id: "tx-2",
      type: "INCOME",
      amount: new Prisma.Decimal("100"),
    } as any);

    const result = await transactionService.createTransaction("user-1", {
      type: "INCOME",
      amount: 100,
      accountId: "account-1",
      date: "2024-01-15T00:00:00.000Z",
    });

    expect(result.id).toBe("tx-2");
  });
});
