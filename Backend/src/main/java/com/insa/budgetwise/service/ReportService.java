package com.insa.budgetwise.service;

import com.insa.budgetwise.dto.ReportResponse;
import com.insa.budgetwise.entity.Expense;
import com.insa.budgetwise.entity.Income;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

        private final IncomeService incomeService;
        private final ExpenseService expenseService;

        public ReportResponse getMyReport(String email) {

                double totalIncome = incomeService.getMyIncomes(email)
                                .stream()
                                .mapToDouble(Income::getAmount)
                                .sum();

                double totalExpense = expenseService.getMyExpenses(email)
                                .stream()
                                .mapToDouble(Expense::getAmount)
                                .sum();

                return ReportResponse.builder()
                                .totalIncome(totalIncome)
                                .totalExpense(totalExpense)
                                .netBalance(totalIncome - totalExpense)
                                .build();
        }
}