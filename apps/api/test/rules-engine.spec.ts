import { RulesEngine } from '../src/modules/accounting/engine/rules-engine.service';
import { Decimal } from 'decimal.js';

describe('RulesEngine', () => {
  let engine: RulesEngine;

  beforeEach(() => {
    engine = new RulesEngine();
  });

  const mockRule = {
    id: 'R1',
    name: 'Cash Sale',
    triggerEvent: 'ORDER_PAID',
    priority: 10,
    isActive: true,
    conditions: [{ field: 'payment.method', op: 'eq', value: 'CASH' }],
    entryLines: [
      { account_key: 'CASH', side: 'DEBIT', formula: 'payment.amount' },
      { account_key: 'REVENUE', side: 'CREDIT', formula: 'order.total' }
    ]
  };

  it('should generate a balanced journal entry for cash sale', () => {
    const event = {
      type: 'ORDER_PAID',
      payment: { method: 'CASH', amount: 100 },
      order: { total: 100 }
    };
    
    const mappings = { 'CASH': '1001', 'REVENUE': '4001' };
    const result = engine.process(event, [mockRule as any], mappings);

    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].amount.toString()).toBe('100');
    expect(result.lines[1].amount.toString()).toBe('100');
  });

  it('should throw if the entry is unbalanced', () => {
    const badRule = {
      ...mockRule,
      entryLines: [
        { account_key: 'CASH', side: 'DEBIT', formula: '100' },
        { account_key: 'REVENUE', side: 'CREDIT', formula: '90' }
      ]
    };

    const event = { type: 'ORDER_PAID' };
    expect(() => engine.process(event, [badRule as any], {})).toThrow(/Unbalanced/);
  });
});
