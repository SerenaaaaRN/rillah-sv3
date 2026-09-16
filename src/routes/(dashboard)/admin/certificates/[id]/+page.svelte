<script lang="ts">
	import CertificateForm from '../_components/certificate-form.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<CertificateForm mode="edit" certificate={data.certificate} />
