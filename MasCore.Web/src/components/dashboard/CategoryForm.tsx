import { useEffect, useState } from "react";

import api from "../../services/api";

import type {
  Category,
  CategoryInput,
} from "../../types";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const isEditing = !!category;

  const [form, setForm] = useState<CategoryInput>({
    name: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description ?? "",
      });
    } else {
      setForm({
        name: "",
        description: "",
      });
    }

    setError("");
  }, [category]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: CategoryInput = {
        name: form.name.trim(),
        description:
          form.description?.trim() || undefined,
      };

      if (isEditing && category) {
        await api.put(
          `/api/categories/${category.id}`,
          payload,
        );
      } else {
        await api.post(
          "/api/categories",
          payload,
        );
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Failed to update category."
          : "Failed to create category.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-form-overlay">
      <div className="dashboard-form glass-panel">
        <div className="dashboard-form-header">
          <div>
            <span className="section-eyebrow">
              ORGANIZATION
            </span>

            <h2>
              {isEditing
                ? "Edit Category"
                : "New Category"}
            </h2>
          </div>

          <button
            type="button"
            className="form-close-button"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field form-field-full">
              <span>Name</span>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Web Development"
                required
              />
            </label>

            <label className="form-field form-field-full">
              <span>Description</span>

              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Category description"
                rows={4}
              />
            </label>
          </div>

          <div className="dashboard-form-actions">
            <button
              type="button"
              className="form-secondary-button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="form-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}