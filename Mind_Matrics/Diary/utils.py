from gradio_client import Client
from .models import DiaryEntry,DiaryFolder


def fetch_das_scores(entry_id, diary_text ,client):
    """
    Sends diary content to the Gradio API and updates the entry with DAS scores.
    """
    try:
        result = client.predict(
            diary_text=diary_text,  # Send diary text for analysis
            api_name="/predict"
        )

        das_scores = result[1]  # Extract DAS scores from response
        depression = das_scores.get("Depression", 0)
        anxiety = das_scores.get("Anxiety", 0)
        stress = das_scores.get("Stress", 0)

        # ✅ Update DiaryEntry in the database
        entry = DiaryEntry.objects.get(id=entry_id)
        entry.depression_score = depression
        entry.anxiety_score = anxiety
        entry.stress_score = stress
        entry.save()

        return result

    except Exception as e:
        return f"Error fetching DAS scores: {str(e)}"

def calculate_cumulative_scores(folder):
    """Calculate cumulative DAS scores when all 5 entries are available."""
    entries = folder.entries.all()  # ✅ Fetch entries related to this folder
    print(entries)

    if len(entries) == 5:
        folder.cumulative_depression_score = sum(e.depression_score for e in entries if e.depression_score) / 5
        folder.cumulative_anxiety_score = sum(e.anxiety_score for e in entries if e.anxiety_score) / 5
        folder.cumulative_stress_score = sum(e.stress_score for e in entries if e.stress_score) / 5
        folder.save()