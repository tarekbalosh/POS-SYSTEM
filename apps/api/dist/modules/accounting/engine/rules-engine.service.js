"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesEngine = void 0;
const common_1 = require("@nestjs/common");
const mathjs_1 = require("mathjs");
const decimal_js_1 = require("decimal.js");
const math = (0, mathjs_1.create)(mathjs_1.all, {
    number: 'BigNumber',
    precision: 20,
});
let RulesEngine = class RulesEngine {
    process(event, rules, mappings) {
        const rule = this.findRule(event, rules);
        if (!rule)
            throw new Error(`No matching rule for event ${event.type}`);
        const lines = rule.entryLines.map(line => ({
            accountCode: mappings[line.account_key] || line.account_key,
            side: line.side,
            amount: this.evaluateFormula(line.formula, event)
        }));
        this.validateBalanced(lines);
        return { ruleId: rule.id, lines };
    }
    findRule(event, rules) {
        return rules
            .filter(r => r.isActive && r.triggerEvent === event.type)
            .filter(r => this.evaluateConditions(r.conditions, event))
            .sort((a, b) => b.priority - a.priority)[0];
    }
    evaluateConditions(conditions, event) {
        return conditions.every(c => {
            const actual = this.resolvePath(c.field, event);
            switch (c.op) {
                case 'eq': return actual === c.value;
                case 'gt': return Number(actual) > Number(c.value);
                case 'lt': return Number(actual) < Number(c.value);
                case 'in': return Array.isArray(c.value) && c.value.includes(actual);
                default: return false;
            }
        });
    }
    evaluateFormula(formula, event) {
        const scope = this.flattenEvent(event);
        try {
            const result = math.evaluate(formula, scope);
            return new decimal_js_1.Decimal(result.toString());
        }
        catch (e) {
            console.error(`Formula evaluation failed: ${formula}`, e);
            throw e;
        }
    }
    validateBalanced(lines) {
        const totalDebit = lines.filter(l => l.side === 'DEBIT').reduce((s, l) => s.plus(l.amount), new decimal_js_1.Decimal(0));
        const totalCredit = lines.filter(l => l.side === 'CREDIT').reduce((s, l) => s.plus(l.amount), new decimal_js_1.Decimal(0));
        if (!totalDebit.equals(totalCredit)) {
            throw new Error(`Unbalanced entry: Dr ${totalDebit} vs Cr ${totalCredit}`);
        }
    }
    resolvePath(path, obj) {
        return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
    }
    flattenEvent(event, prefix = '') {
        const result = {};
        for (const key in event) {
            const val = event[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                Object.assign(result, this.flattenEvent(val, newKey));
            }
            else {
                result[newKey] = typeof val === 'object' ? val : (isNaN(Number(val)) ? val : Number(val));
                result[key] = result[newKey];
            }
        }
        return result;
    }
};
exports.RulesEngine = RulesEngine;
exports.RulesEngine = RulesEngine = __decorate([
    (0, common_1.Injectable)()
], RulesEngine);
//# sourceMappingURL=rules-engine.service.js.map