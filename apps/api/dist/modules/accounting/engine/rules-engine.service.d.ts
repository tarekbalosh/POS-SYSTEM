import { Decimal } from 'decimal.js';
export interface AccountingRule {
    id: string;
    name: string;
    triggerEvent: string;
    priority: number;
    isActive: boolean;
    conditions: any[];
    entryLines: any[];
}
export declare class RulesEngine {
    process(event: any, rules: AccountingRule[], mappings: Record<string, string>): {
        ruleId: string;
        lines: {
            accountCode: any;
            side: any;
            amount: Decimal;
        }[];
    };
    private findRule;
    private evaluateConditions;
    private evaluateFormula;
    private validateBalanced;
    private resolvePath;
    private flattenEvent;
}
