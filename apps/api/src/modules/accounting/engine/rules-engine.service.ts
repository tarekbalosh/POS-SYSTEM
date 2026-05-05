import { Injectable } from '@nestjs/common';
import { create, all } from 'mathjs';
import { Decimal } from 'decimal.js';

const math = create(all, {
  number: 'BigNumber',
  precision: 20,
});

export interface AccountingRule {
  id: string;
  name: string;
  triggerEvent: string;
  priority: number;
  isActive: boolean;
  conditions: any[];
  entryLines: any[];
}

@Injectable()
export class RulesEngine {
  process(
    event: any,
    rules: AccountingRule[],
    mappings: Record<string, string>,
  ) {
    const rule = this.findRule(event, rules);
    if (!rule) throw new Error(`No matching rule for event ${event.type}`);

    const lines = rule.entryLines.map((line) => ({
      accountCode: mappings[line.account_key] || line.account_key,
      side: line.side,
      amount: this.evaluateFormula(line.formula, event),
    }));

    this.validateBalanced(lines);
    return { ruleId: rule.id, lines };
  }

  private findRule(event: any, rules: AccountingRule[]) {
    return rules
      .filter((r) => r.isActive && r.triggerEvent === event.type)
      .filter((r) => this.evaluateConditions(r.conditions, event))
      .sort((a, b) => b.priority - a.priority)[0];
  }

  private evaluateConditions(conditions: any[], event: any): boolean {
    return conditions.every((c) => {
      const actual = this.resolvePath(c.field, event);
      switch (c.op) {
        case 'eq':
          return actual === c.value;
        case 'gt':
          return Number(actual) > Number(c.value);
        case 'lt':
          return Number(actual) < Number(c.value);
        case 'in':
          return Array.isArray(c.value) && c.value.includes(actual);
        default:
          return false;
      }
    });
  }

  private evaluateFormula(formula: string, event: any): Decimal {
    // Replace paths like "order.total" with their values
    const scope = this.flattenEvent(event);
    try {
      const result = math.evaluate(formula, scope);
      return new Decimal(result.toString());
    } catch (e) {
      console.error(`Formula evaluation failed: ${formula}`, e);
      throw e;
    }
  }

  private validateBalanced(lines: any[]) {
    const totalDebit = lines
      .filter((l) => l.side === 'DEBIT')
      .reduce((s, l) => s.plus(l.amount), new Decimal(0));
    const totalCredit = lines
      .filter((l) => l.side === 'CREDIT')
      .reduce((s, l) => s.plus(l.amount), new Decimal(0));
    if (!totalDebit.equals(totalCredit)) {
      throw new Error(
        `Unbalanced entry: Dr ${totalDebit} vs Cr ${totalCredit}`,
      );
    }
  }

  private resolvePath(path: string, obj: any) {
    return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
  }

  private flattenEvent(event: any, prefix = '') {
    const result: any = {};
    for (const key in event) {
      const val = event[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.assign(result, this.flattenEvent(val, newKey));
      } else {
        result[newKey] =
          typeof val === 'object'
            ? val
            : isNaN(Number(val))
              ? val
              : Number(val);
        // Also add simple keys for mathjs
        result[key] = result[newKey];
      }
    }
    return result;
  }
}
