Google Reviews Integration Feasibility
Quick Integration Timeline: 2-4 hours for a basic implementation, but there are significant challenges for a demo:
Challenges for Demo/Mock Data:

No Real Place IDs: Google Reviews require actual Google Place IDs - your properties like "Charming studio in the 14th arrondissement" won't have these
API Key Required: Need a Google Cloud account with billing enabled
CORS Issues: Google Places API doesn't support direct browser calls - you'd need a backend proxy
Cost: Each API call costs money (though minimal) but there is a free tier.

