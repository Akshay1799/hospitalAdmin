"use client";

import React, { useState } from "react";
import { mockShiftTemplates, ShiftTemplate } from "@/lib/mock/nursing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { ShiftTemplateForm } from "@/components/shift-templates/ShiftTemplateForm";
import { DeleteShiftTemplateModal } from "@/components/shift-templates/DeleteShiftTemplateModal";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShiftTemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ShiftTemplate[]>(mockShiftTemplates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | undefined>(undefined);
  const [templateToDelete, setTemplateToDelete] = useState<ShiftTemplate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (template: ShiftTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (template: ShiftTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
    toast({
      title: "Shift Template Deleted",
      description: `"${templateToDelete.name}" has been permanently removed from the template catalog.`,
      variant: "destructive",
    });
    setTemplateToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shift Templates</h1>
          <p className="text-muted-foreground mt-1">Configure hospital-wide default shift timings.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCreateNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                  No shift templates available. Click &quot;Create Template&quot; to add one.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {template.name}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{template.startTime}</TableCell>
                  <TableCell className="font-mono text-sm">{template.endTime}</TableCell>
                  <TableCell>
                    {template.isDefault ? (
                      <Badge variant="secondary">Hospital Default</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Custom</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                        onClick={() => handleDeleteClick(template)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ShiftTemplateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        template={editingTemplate}
      />

      <DeleteShiftTemplateModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        template={templateToDelete}
      />
    </div>
  );
}
