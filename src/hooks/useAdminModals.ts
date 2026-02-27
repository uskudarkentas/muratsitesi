"use client";

import { useState } from "react";
import { deleteStage, deletePost } from "@/actions/admin";
import { completeStage } from "@/actions/stage";

export function useAdminModals() {
    // Original states from AdminTimeline
    const [stageToDelete, setStageToDelete] = useState<number | null>(null);
    const [stageToComplete, setStageToComplete] = useState<number | null>(null);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
    const [postToEdit, setPostToEdit] = useState<any | null>(null);
    const [initialPostType, setInitialPostType] = useState<'ANNOUNCEMENT' | 'MEETING' | 'SURVEY' | null>(null);
    const [initialContentType, setInitialContentType] = useState<'heading' | 'text' | 'image' | null>(null);

    // Handlers
    const handleQuickAddPost = (stageId: number, postType: 'ANNOUNCEMENT' | 'MEETING' | 'SURVEY' | null = null) => {
        setSelectedStageId(stageId);
        setInitialPostType(postType);
        setInitialContentType(null);
        setShowAnnouncementModal(true);
    };

    const handleEditPost = (stageId: number, post: any) => {
        setSelectedStageId(stageId);
        setPostToEdit(post);
        setShowAnnouncementModal(true);
    };

    const handleDeleteStageConfirm = async () => {
        if (stageToDelete === null) return;
        if (stageToDelete <= 12) {
            alert('Varsayılan aşamalar silinemez.');
            setStageToDelete(null);
            return;
        }

        try {
            await deleteStage(stageToDelete);
            setStageToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete stage:", error);
            alert("Aşama silinirken bir hata oluştu.");
        }
    };

    const handleCompleteStageConfirm = async () => {
        if (stageToComplete === null) return;
        try {
            const result = await completeStage(stageToComplete);
            setStageToComplete(null);
            if (result.success) {
                alert(result.message);
                window.location.reload();
            } else {
                alert("Hata: " + result.message);
            }
        } catch (error) {
            console.error("Failed to complete stage:", error);
            alert("İşlem sırasında bir hata oluştu.");
            setStageToComplete(null);
        }
    };

    const handleDeletePostConfirm = async () => {
        if (!postToDelete) return;
        try {
            const result = await deletePost(postToDelete);
            if (result.success) {
                setPostToDelete(null);
                window.location.reload();
            } else {
                alert("Hata: " + result.error);
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("İşlem silinirken bir hata oluştu.");
        }
    };

    const closeAnnouncementModal = () => {
        setShowAnnouncementModal(false);
        setSelectedStageId(null);
        setInitialContentType(null);
        setInitialPostType(null);
        setPostToEdit(null);
    };

    return {
        // States
        stageToDelete,
        setStageToDelete,
        stageToComplete,
        setStageToComplete,
        postToDelete,
        setPostToDelete,
        showAnnouncementModal,
        setShowAnnouncementModal,
        selectedStageId,
        postToEdit,
        initialPostType,
        initialContentType,

        // Handlers
        handleQuickAddPost,
        handleEditPost,
        handleDeleteStageConfirm,
        handleCompleteStageConfirm,
        handleDeletePostConfirm,
        closeAnnouncementModal
    };
}
