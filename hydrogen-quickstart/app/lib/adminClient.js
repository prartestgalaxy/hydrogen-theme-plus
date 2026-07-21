export function createAdminClient ({
    storeDomain,
    privateAdminToken,
    adminApiVersion
}) {
    const admin = async function (query, {variables = {}}) {
        if(!query){
            throw new Error("Must provide a query to admin client");
        }
        const endpoint = `https://${storeDomain}/admin/api/${adminApiVersion}/graphql.json`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': privateAdminToken
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        };
        const request = await fetch(endpoint,options);
        if(!request.ok){
            throw new Error('GraphQL api request not ok')
        }
        const response = await request.json();
        if(response?.errors?.length){
            throw new Error(response?.errors[0].message)
        }
        return response;
    };
    return {admin}
}